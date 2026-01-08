import{S as n,A as o}from"./autoplay-Co95q9Q1.js";function c(l){const s=$(".reviews");if(!s.length)return;const r=[{stars:5,title:"Easy monitoring your weight goal!",phrase:"Love Vitamins! The individual packets make it so easy to remember your daily vitamins and makes travelling easy!!! 👍🏽",icon:"img/components/reviews/reviews-david.png",name:"David S."},{stars:4,title:"High quality vitamins & supplements",phrase:"High quality vitamins & supplements, very easy on my stomach too. Great service! I really like the flexibility and options available in the subscriptions.",icon:"img/components/reviews/reviews-bridget.png",name:"Bridget T."},{stars:5,title:"I love it",phrase:"I love it. It makes me feel good each morning and then it also makes me feel accomplished.",icon:"img/components/reviews/reviews-jenna.png",name:"Jenna Y."}];let i="";$.each(r,function(v,e){let a="";for(let t=0;t<e.stars;t++)a+=`
        <svg class="reviews__icon">
          <use href="#icon-reviews-star"></use>
        </svg>`;i+=`
      <div class="reviews__item swiper-slide">
        <div class="reviews__content">
          <div class="reviews__icons">
            ${a}
          </div>
          <p class="reviews__title">${e.title}</p>
          <p class="reviews__phrase">${e.phrase}</p>
        </div>
        <div class="reviews__person">
          <img src="${e.icon}" alt="${e.name}" class="reviews__person-img">
          <p class="reviews__person-name">${e.name}</p>
        </div>
      </div>
    `}),s.html(`
    <div class="reviews__swiper swiper">
      <div class="reviews__list swiper-wrapper">
        ${i}
      </div>
    </div>
  `),new n(".reviews__swiper",{modules:[o],loop:!0,speed:600,autoplay:{delay:5e3,disableOnInteraction:!1},slidesPerView:"auto",spaceBetween:10,grabCursor:!0,breakpoints:{1024:{spaceBetween:33},1799:{enabled:!1}}})}export{c as initReviews};
