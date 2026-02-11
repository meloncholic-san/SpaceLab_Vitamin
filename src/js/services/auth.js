import { supabase } from '../api/supabase';

export async function signUp({
  email,
  password,
  first_name,
  last_name,
  role = 'regular',
  temp_document_path = 'NULL'
}) {
  console.group('🟢 SIGN UP START');
  console.log('Input:', { email, first_name, last_name, role });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        first_name,
        last_name,
        temp_document_path
      }
    }
  });

  console.log('Auth response:', { data, error });

  if (error) {
    console.error('❌ Auth signUp error:', error);
    console.groupEnd();
    throw error;
  }
  const user = data.user;

  if (!user) {
    console.error('❌ User is null after signUp');
    console.groupEnd();
    throw new Error('User not created');
  }

  console.log('✅ User created:', user.id);


  console.log('✅ Sign up complete! Profile created by trigger.');
  console.groupEnd();

  return user;
}

export async function uploadTempDocument(file) {

    const tempPath = `temp/${crypto.randomUUID()}-${file.name}`

    const { error } = await supabase.storage
      .from('documents')
      .upload(tempPath, file)

    if (error) {
      alert('File upload failed')
      return
    }

    return tempPath;
}




export async function signIn({ email, password }) {
  console.group('🔑 SIGN IN');
  console.log('Email:', email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('Sign in result:', { data, error });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        throw new Error({
          type: 'EMAIL_NOT_CONFIRMED',
          message: 'Please confirm your email first. Check your inbox.',
          email: email
        });
      }
      if (error.message.includes('Invalid login credentials')) {
        throw new Error({
          type: 'INVALID_CREDENTIALS',
          message: 'Wrong email or password'
        });
      }
      throw error;
    }

    console.log('✅ User signed in:', data.user.id);
    console.groupEnd();
    
    return {
      success: true,
      user: data.user,
      session: data.session
    };

  } catch (err) {
    console.error('❌ Sign in error:', err);
    console.groupEnd();
    throw err;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function getCurrentUser() {
  return supabase.auth.getUser();
}

export function getCurrentSession() {
  return supabase.auth.getSession()
}


export async function requestPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `profile/reset-password`
  });

  if (error) {
    console.error('Password reset request error:', error);
    throw error;
  }

  return { success: true };
}

export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    console.error('Password update error:', error);
    throw error;
  }

  return data.user;
}


export function listenAuthStatus () {
    supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event);
    
    switch (event) {
      case 'SIGNED_IN':
        console.log('User signed in:', session?.user.email);
        break;
        
      case 'SIGNED_OUT':
        console.log('User signed out');
        window.location.href = '/login';
        break;
        
      case 'USER_UPDATED':
        console.log('User updated');
        break;
        
      case 'TOKEN_REFRESHED':
        console.log('Token refreshed');
        break;
        
      case 'PASSWORD_RECOVERY':
        console.log('Password recovery');
        break;
    }
  });
}