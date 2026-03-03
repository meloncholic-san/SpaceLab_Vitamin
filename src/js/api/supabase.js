import { createClient } from '@supabase/supabase-js';
import { getGuestId } from '../services/guest';


export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);



export const guestSupabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
        global: {
            headers: {
                'x-guest-id': getGuestId()
            }
        }
    }
);