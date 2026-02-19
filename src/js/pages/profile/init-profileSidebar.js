import { signOut } from "../../services/auth";

export function initProfileSidebar() {
    const navButtons = document.querySelectorAll('.profile-sidebar__btn:not(.signout)');
    const sections = document.querySelectorAll('.profile__section');
    
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    
    function updateQueryParam(param, value) {
        const url = new URL(window.location);
        url.searchParams.set(param, value);
        window.history.pushState({}, '', url);
    }

    function switchSection(sectionId) {

        sections.forEach(section => {
            section.classList.remove('active');
        });
        

        const activeSection = document.getElementById(`section-${sectionId}`);
        if (activeSection) {
            activeSection.classList.add('active');
        }
        

        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === sectionId) {
                btn.classList.add('active');
            }
        });
        
        updateQueryParam('tab', sectionId);
    }
    

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = btn.dataset.section;
            switchSection(sectionId);
        });
    });
    

    const queryTab = getQueryParam('tab');
    const validSections = ['overview', 'orders', 'subscriptions', 'billing', 'password'];
    const initialSection = (queryTab && validSections.includes(queryTab)) ? queryTab : 'subscriptions';
    
    switchSection(initialSection);
    

    const signoutBtn = document.querySelector('.profile-sidebar__btn.signout');
    if (signoutBtn) {
        signoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await signOut();
            window.location.href = '/';
        });
    }
    
    window.addEventListener('popstate', () => {
        const newTab = getQueryParam('tab') || 'subscriptions';
        switchSection(newTab);
    });
}