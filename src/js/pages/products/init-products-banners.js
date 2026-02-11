import Swiper from 'swiper';
import 'swiper/css';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

export function initProductsBanners() {
    


    const swiperElement = document.querySelector('.products-hero-swiper');
    if (!swiperElement) return;

    const bannersSwiper = new Swiper('.products-hero-swiper', {
        modules: [Autoplay, Navigation, Pagination],
        
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 800,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        resistanceRatio: 0.85,
        
        autoplay: {
            delay: 500000,
            disableOnInteraction: false,
        },
        
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 10,
                loop: false,
            },
            1024: {
                slidesPerView: 1.24,
                spaceBetween: 50,
                centeredSlides: true,
                slidesOffsetBefore: 30,
                slidesOffsetAfter: 30,
                loop: true,
            }
        },

    
    on: {
        init(swiper) {
            if (window.innerWidth >= 1024) {
                swiper.slideTo(1, 0, false);
            }
        },
    }

        
    });

    return bannersSwiper;
}