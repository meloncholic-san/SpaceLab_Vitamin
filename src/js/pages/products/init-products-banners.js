import Swiper from 'swiper';
import 'swiper/css';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

export function initProductsBanners() {
    
    // function updateSlidesState(swiper) {
    //     swiper.slides.forEach(slide => {
    //         slide.classList.remove('is-active', 'is-prev', 'is-next');
    //     });

    //     const active = swiper.slides[swiper.activeIndex];
    //     const prev = swiper.slides[swiper.activeIndex - 1];
    //     const next = swiper.slides[swiper.activeIndex + 1];

    //     if (active) active.classList.add('is-active');
    //     if (prev) prev.classList.add('is-prev');
    //     if (next) next.classList.add('is-next');
    // }

    

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
                loop: true,
            },
            1024: {
                slidesPerView: 1.24,
                spaceBetween: 50,
                centeredSlides: true,
                slidesOffsetBefore: 30,
                slidesOffsetAfter: 30,
                loop: false,
            }
        },

    // on: {
    //     init(swiper) {
    //         updateSlidesState(swiper);
    //     },

    //     slideChangeTransitionStart(swiper) {
    //         updateSlidesState(swiper);
    //     },
    // }
    
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