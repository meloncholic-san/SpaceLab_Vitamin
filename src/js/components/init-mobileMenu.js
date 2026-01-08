import scrollLock from 'scroll-lock';

export function initMobileMenu() {
    const openBtn = document.querySelector(".header__menu__button-open");
    const mobileMenu = document.querySelector(".mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-menu-nav__link");

    if (!openBtn || !mobileMenu) return;


    openBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        openBtn.classList.toggle("open");

        if (mobileMenu.classList.contains("active")) {
            scrollLock.disablePageScroll();
        } else {
            scrollLock.enablePageScroll();
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
            openBtn.classList.remove("open");
            scrollLock.enablePageScroll();
        });
    });

    let page = window.location.pathname.split("/").pop().replace(".html", "");

    if (page === "" || page === "index") {
        page = "home";
    }

    mobileLinks.forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add("active");
        }
    });
    
    window.addEventListener("resize", () => {
        mobileMenu.classList.remove("active");
        openBtn.classList.remove("open");
        scrollLock.enablePageScroll();
    })
}
