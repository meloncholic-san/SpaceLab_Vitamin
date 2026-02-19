import { supabase } from "../api/supabase";


export function initProfileButton() {
    const profileBtn = document.querySelector('.header__content-profile-btn');
    
    profileBtn?.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const { data: { user } } = await supabase.auth.getUser();
        
        window.location.href = user ? '/profile' : '/login';
    });
}
