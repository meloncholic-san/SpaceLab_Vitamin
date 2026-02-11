import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== Function started ===')
    
    const { type, table, record, old_record } = await req.json()
    
    if (type !== 'UPDATE' || table !== 'users') {
      return new Response(
        JSON.stringify({ message: 'Ignored' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (old_record?.confirmed_at || !record?.confirmed_at) {
      return new Response(
        JSON.stringify({ message: 'Email not confirmed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    console.log(`✅ Email confirmed for user ${record.id}`)
    
    const tempPath = record.raw_user_meta_data?.temp_document_path
    console.log('Temp path from metadata:', tempPath)
    
    if (!tempPath) {
      console.log('No temp document path')
      return new Response(
        JSON.stringify({ message: 'No temp document' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    console.log(`Checking if file exists: ${tempPath}`)

    const pathParts = tempPath.split('/')
    const fileName = pathParts.pop()
    const folder = pathParts.join('/') || '' 
    

    const { data: files, error: listError } = await supabaseClient
      .storage
      .from('documents')
      .list(folder, {
        search: fileName
      })
    
    if (listError) {
      console.error('Error listing files:', listError)
      throw listError
    }
    
    if (!files || files.length === 0) {
      console.error(`File not found: ${tempPath}`)
      
      const { data: allTempFiles } = await supabaseClient
        .storage
        .from('documents')
        .list('temp')
      
      console.log('Files in temp folder:', allTempFiles)
      
      return new Response(
        JSON.stringify({ 
          error: 'File not found',
          searchedPath: tempPath,
          availableFiles: allTempFiles
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      )
    }
    
    console.log(`✅ File found: ${tempPath}`)
    

    const originalFileName = fileName.split('-').slice(1).join('-')
    const finalPath = `wholesale/${record.id}/${originalFileName}`
    
    console.log(`📁 Copying: ${tempPath} → ${finalPath}`)
    

    const { error: copyError } = await supabaseClient
      .storage
      .from('documents')
      .copy(tempPath, finalPath)
    
    if (copyError) {
      console.error('Copy error:', copyError)
      throw copyError
    }
    
    console.log('✅ File copied successfully')
    
    const { error: deleteError } = await supabaseClient
      .storage
      .from('documents')
      .remove([tempPath])
    
    if (deleteError) {
      console.warn('Could not delete temp file:', deleteError)
    } else {
      console.log('🗑️ Temp file deleted')
    }
    
    const { data: urlData } = supabaseClient
      .storage
      .from('documents')
      .getPublicUrl(finalPath)
    
    console.log('🔗 Public URL:', urlData.publicUrl)
    

    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ 
        document_url: urlData.publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', record.id)
    
    if (updateError) {
      console.error('Profile update failed:', updateError)
      throw updateError
    }
    
    console.log('✅ Profile updated')
    

    const { error: metadataError } = await supabaseClient.auth.admin.updateUserById(
      record.id,
      {
        user_metadata: {
          ...record.raw_user_meta_data,
          temp_document_path: null
        }
      }
    )
    
    if (metadataError) {
      console.warn('Metadata cleanup warning:', metadataError)
    } else {
      console.log('✅ Metadata cleaned up')
    }
    
    console.log('=== Function completed successfully ===')
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email confirmation processed',
        userId: record.id,
        documentUrl: urlData.publicUrl,
        tempPath,
        finalPath
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
    
  } catch (error) {
    console.error('❌ Function error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.details
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})