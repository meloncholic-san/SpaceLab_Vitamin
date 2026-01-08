import Swiper from 'swiper';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

export function initMainProjects() {
  const $swiperContainer = $('.main-projects__content-swiper');
  if (!$swiperContainer.length) return;
  

  const slides = [
    {
      image: './img/main/projects/main-projects-image-1.webp',
      category: 'Minerals',
      title: 'Reacted Zinc',
      desc: 'B vitamins are essential for your nervous system and proper brain functioning.'
    },
    {
      image: './img/main/projects/main-projects-image-2.webp',
      category: 'Vitamins & Dietary Supplements',
      title: 'Ortho B Complex',
      desc: 'B vitamins are essential for your nervous system and proper brain functioning.'
    },
    {
      image: './img/main/projects/main-projects-image-1.webp',
      category: 'Minerals',
      title: 'Probiotics',
      desc: 'B vitamins are essential for your nervous system and proper brain functioning.'
    },
    {
      image: './img/main/projects/main-projects-image-2.webp',
      category: 'Vitamins & Dietary Supplements',
      title: 'Omega-3',
      desc: 'B vitamins are essential for your nervous system and proper brain functioning.'
    },
  ];

  let slidesHTML = '';
  $.each(slides, function(index, slide) {
      const colorClass = index % 2 === 0
    ? 'slide-green'
    : 'slide-purple';

    slidesHTML += `
      <div class="main-projects__swiper-slide swiper-slide ${colorClass}">
        <div class="main-projects__swiper-slide-inner">
          <img class="main-projects__swiper-slide-image" src="${slide.image}" alt="${slide.title}" loading="lazy">
          <div class="main-projects__swiper-slide-content">
            <p class="main-projects__swiper-slide-category">${slide.category}</p>
            <h3 class="main-projects__swiper-slide-title">${slide.title}</h3>
            <p class="main-projects__swiper-slide-desc">${slide.desc}</p>
          </div>
        </div>
      </div>
    `;
  });
  
  $swiperContainer.html(`
    <div class="main-projects__swiper">
      <div class="main-projects__swiper-wrapper swiper-wrapper">
        ${slidesHTML}
      </div>
    </div>
  `);
  

  new Swiper('.main-projects__swiper', {
    modules: [Autoplay],
    loop: true,
    speed: 600,
    
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },

    breakpoints: {
      1024: {
        spaceBetween: 33,
      }
    },
    slidesPerView: 'auto',
    spaceBetween: 10,
    grabCursor: true,
    keyboard: {
      enabled: true,
    },
  });
}