import{S as n,A as o}from"./autoplay-Co95q9Q1.js";function c(){const i=$(".main-projects__content-swiper");if(!i.length)return;const r=[{image:"./img/main/projects/main-projects-image-1.webp",category:"Minerals",title:"Reacted Zinc",desc:"B vitamins are essential for your nervous system and proper brain functioning."},{image:"./img/main/projects/main-projects-image-2.webp",category:"Vitamins & Dietary Supplements",title:"Ortho B Complex",desc:"B vitamins are essential for your nervous system and proper brain functioning."},{image:"./img/main/projects/main-projects-image-1.webp",category:"Minerals",title:"Probiotics",desc:"B vitamins are essential for your nervous system and proper brain functioning."},{image:"./img/main/projects/main-projects-image-2.webp",category:"Vitamins & Dietary Supplements",title:"Omega-3",desc:"B vitamins are essential for your nervous system and proper brain functioning."}];let s="";$.each(r,function(a,e){const t=a%2===0?"slide-green":"slide-purple";s+=`
      <div class="main-projects__swiper-slide swiper-slide ${t}">
        <div class="main-projects__swiper-slide-inner">
          <img class="main-projects__swiper-slide-image" src="${e.image}" alt="${e.title}" loading="lazy">
          <div class="main-projects__swiper-slide-content">
            <p class="main-projects__swiper-slide-category">${e.category}</p>
            <h3 class="main-projects__swiper-slide-title">${e.title}</h3>
            <p class="main-projects__swiper-slide-desc">${e.desc}</p>
          </div>
        </div>
      </div>
    `}),i.html(`
    <div class="main-projects__swiper">
      <div class="main-projects__swiper-wrapper swiper-wrapper">
        ${s}
      </div>
    </div>
  `),new n(".main-projects__swiper",{modules:[o],loop:!0,speed:600,autoplay:{delay:5e3,disableOnInteraction:!1},breakpoints:{1024:{spaceBetween:33}},slidesPerView:"auto",spaceBetween:10,grabCursor:!0,keyboard:{enabled:!0}})}export{c as initMainProjects};
