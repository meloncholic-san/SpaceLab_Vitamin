import { initMobileMenu } from "./init-mobileMenu";


export function initHeader() {
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
}
