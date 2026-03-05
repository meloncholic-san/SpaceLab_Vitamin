import scrollLock from "scroll-lock";
import { signOut } from "../services/auth";

export function initMobileMenu() {

    const menu = document.getElementById("mobileMenu")
    const openBtn = document.getElementById("menuOpen")
    const closeBtn = document.querySelector(".mobile-menu__close")
    const profileBtn = document.querySelector(".mobile-menu-profile-btn")
    const screens = document.querySelectorAll(".mobile-menu__screen")
    const title = document.querySelector(".mobile-menu__title")
    const backBtn = document.querySelector(".mobile-menu__back")

    let history = []

    if(!menu || !openBtn) return


    function openMenu(){
        menu.classList.add("open")
        scrollLock.disablePageScroll()
    }

    function closeMenu(){
        menu.classList.remove("open")
        scrollLock.enablePageScroll()

        history = []

        screens.forEach(s => s.classList.remove("active"))
        document.querySelector('[data-screen="main"]').classList.add("active")

        title.textContent = ""
        backBtn.classList.remove("visible")
    }

    openBtn.addEventListener("click", openMenu)
    closeBtn.addEventListener("click", closeMenu)


    function openScreen(name){

        const current = document.querySelector(".mobile-menu__screen.active")

        history.push(current.dataset.screen)

        screens.forEach(s => s.classList.remove("active"))

        const next = document.querySelector(`[data-screen="${name}"]`)

        next.classList.add("active")

        title.textContent = name.charAt(0).toUpperCase() + name.slice(1)

        backBtn.classList.add("visible");
        closeBtn.classList.add('hidden');
        profileBtn.classList.add('hidden');
    }


    document.querySelectorAll("[data-open]").forEach(btn => {

        btn.addEventListener("click", () => {
            openScreen(btn.dataset.open)
        })

    })

    profileBtn?.addEventListener("click", () => {
        openScreen("profile")
    })

    backBtn.addEventListener("click", () => {

        const prev = history.pop()

        if(!prev) return

        screens.forEach(s => s.classList.remove("active"))

        document.querySelector(`[data-screen="${prev}"]`).classList.add("active")

        title.textContent = prev === "main" ? "" : prev

        if(prev === "main"){
            backBtn.classList.remove("visible")
            closeBtn.classList.remove('hidden')
            profileBtn.classList.remove('hidden');

        }

    })

    const signoutBtn = document.querySelector('.mobile-menu__item.logout');
    if (signoutBtn) {
        signoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await signOut();
            window.location.href = '/';
        });
    }

    window.addEventListener("resize", () => {

        if(menu.classList.contains("open")){
            closeMenu()
        }

    })
}