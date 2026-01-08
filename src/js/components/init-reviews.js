import Swiper from 'swiper';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

export function initReviews(reviews) {
  const $reviewsContainer = $('.reviews');
  if (!$reviewsContainer.length) return;

  const testreviews = [
    {
      stars: 5,
      title: 'Easy monitoring your weight goal!',
      phrase: 'Love Vitamins! The individual packets make it so easy to remember your daily vitamins and makes travelling easy!!! 👍🏽',
      icon: 'img/components/reviews/reviews-david.png',
      name: 'David S.'
    },
    {
      stars: 4,
      title: 'High quality vitamins & supplements',
      phrase: 'High quality vitamins & supplements, very easy on my stomach too. Great service! I really like the flexibility and options available in the subscriptions.',
      icon: 'img/components/reviews/reviews-bridget.png',
      name: 'Bridget T.'
    },
    {
      stars: 5,
      title: 'I love it',
      phrase: 'I love it. It makes me feel good each morning and then it also makes me feel accomplished.',
      icon: 'img/components/reviews/reviews-jenna.png',
      name: 'Jenna Y.'
    },
  ];

  let reviewsHTML = '';

  $.each(testreviews, function (index, review) {
    let starsHTML = '';
    for (let i = 0; i < review.stars; i++) {
      starsHTML += `
        <svg class="reviews__icon">
          <use href="#icon-reviews-star"></use>
        </svg>`;
    }

    reviewsHTML += `
      <div class="reviews__item swiper-slide">
        <div class="reviews__content">
          <div class="reviews__icons">
            ${starsHTML}
          </div>
          <p class="reviews__title">${review.title}</p>
          <p class="reviews__phrase">${review.phrase}</p>
        </div>
        <div class="reviews__person">
          <img src="${review.icon}" alt="${review.name}" class="reviews__person-img">
          <p class="reviews__person-name">${review.name}</p>
        </div>
      </div>
    `;
  });

  $reviewsContainer.html(`
    <div class="reviews__swiper swiper">
      <div class="reviews__list swiper-wrapper">
        ${reviewsHTML}
      </div>
    </div>
  `);

  new Swiper('.reviews__swiper', {
    modules: [Autoplay],
    loop: true,
    speed: 600,

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },

    slidesPerView: 'auto',
    spaceBetween: 10,
    grabCursor: true,
    breakpoints: {
    1024: {
      spaceBetween: 33,
    },
    1799: {
        enabled: false,
    },
    }
  });
}
