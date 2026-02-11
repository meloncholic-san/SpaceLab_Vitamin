import { supabase } from '../api/supabase';

export async function wholesaleFileUpload() {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    console.log('No session found')
    return
  }

  console.log('Access token exists:', !!session.access_token)
  console.log('Token length:', session.access_token?.length)

  console.log('Session structure:', {
    hasAccessToken: !!session.access_token,
    Access_token: session.access_token,
    hasUser: !!session.user,
    userEmail: session.user?.email,
    expiresAt: new Date(session.expires_at * 1000)
  })

  try {
    const response = await fetch(
      'https://qdqbtiofhnjnfvortswl.supabase.co/functions/v1/init-wholesale-user',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Response error:', response.status, errorText)
      return
    }

    const data = await response.json()
    console.log('Success:', data)
  } catch (error) {
    console.error('Fetch error:', error)
  }
}