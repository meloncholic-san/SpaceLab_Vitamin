import { initMobileMenu } from "./init-mobileMenu";


export function initHeader() {
    const header = document.querySelector(".header")
    const links = document.querySelectorAll(".header__nav__link");

    let page = window.location.pathname.split("/").pop().replace(".html", "");

    if (page === "" || page === "index") {
        page = "home";
    }

    links.forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add("active");
        }
    });

    initMobileMenu();

    window.addEventListener('scroll', () => {
        header.classList.toggle('scroll', window.scrollY >= header.offsetHeight);
    });
}
