import { supabase } from "../api/supabase";

export async function uploadWholesaleDocument(file) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authorized");

  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${timestamp}-${randomString}-${safeFileName}`;
  
  const tempPath = `temp/${fileName}`;
  
  console.log('Uploading to temp path:', tempPath);

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(tempPath, file);

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      temp_document_path: tempPath

    }
  });

  if (updateError) {
    console.error('Error updating user metadata:', updateError);
    throw updateError;
  }

  return { success: true };
}

export async function getWholesaleDocumentUrl(userId) {
  try {

    const { data: files, error } = await supabase.storage
      .from('documents')
      .list(`wholesale/${userId}`, {
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('Error listing files:', error);
      return { fileUrl: null, fileName: null };
    }

    if (!files || files.length === 0) {
      return { fileUrl: null, fileName: null };
    }


    const latestFile = files[0];
    
    const originalFileName = latestFile.name.split('-').slice(2).join('-') || latestFile.name;
    
    const filePath = `wholesale/${userId}/${latestFile.name}`;
    
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return {
      fileUrl: data.publicUrl,
      fileName: originalFileName, 
      fullFileName: latestFile.name, 
      uploadedAt: latestFile.created_at 
    };
  } catch (error) {
    console.error('Error getting wholesale document:', error);
    return { fileUrl: null, fileName: null };
  }
}
