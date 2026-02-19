import '@scss/styles.scss';

import { initHeader } from './components/init-header';
import { initLazyImages } from './components/init-lazyimages';
import { useLoadFunction } from 'lazy-viewport-loader';
import { listenAuthStatus } from './services/auth';
import { wholesaleFileUpload } from './utils/wholesale-file-upload';
import { initCart } from './components/init-cart';
import { initProfileButton } from './utils/init-profile-button';
// import { initProduct } from './pages/product';
// import { initMain } from './pages/main';
// import { initProducts } from './pages/products';

document.addEventListener('DOMContentLoaded', async () => {
  initHeader();
  initLazyImages();
  listenAuthStatus();
  wholesaleFileUpload();
  initCart();
  initProfileButton();
  const page = document.body.dataset.page;


  if (page === 'main') {
    const { initMain } = await import('./pages/main');
    initMain();
  }

  if (page === 'products') {
    const { initProducts } = await import('./pages/products');
    initProducts();
  }

  if (page === 'product') {
    const { initProduct } = await import('./pages/product');
      initProduct()
  }
  if (page === 'register') {
    const { initRegisterPage } = await import('./pages/register');
      initRegisterPage()
  }

  if (page === 'login') {
    const { initLoginPage } = await import('./pages/login');
    initLoginPage();
  }
  
  if (page === 'password-recovery') {
    const { initPasswordRecovery } = await import('./pages/password-recovery');
      initPasswordRecovery();
  }
  if (page === 'checkout') {
    const { initCheckout } = await import('./pages/checkout/init-checkout');
    initCheckout();
  }
  
  if (page === 'profile') {
    const { initProfile } = await import('./pages/profile/init-profile');
    initProfile();
  }

  // initMain();
  // initProducts();

  // useLoadFunction(
  //   async () => {
  //     const { initAbout } = await import('./pages/main/init-about');
  //     initAbout();
  //   },
  //   '.main-about'
  // );

  // useLoadFunction(
  //   async () => {
  //     const { initRoadmap } = await import('./pages/main/init-roadmap');
  //     initRoadmap();
  //   },
  //   '.main-roadmap'
  // );

  // useLoadFunction(
  //   async () => {
  //     const { initMainMedia } = await import('./pages/main/init-media');
  //     initMainMedia();
  //   },
  //   '.main-media'
  // );

  // useLoadFunction(
  //   async () => {
  //       const { initBrands } = await import('./pages/main/init-brands');
  //       initBrands();
  //   },
  //   '.main-brands'
  // );


  //   useLoadFunction(
  //   async () => {
  //       const { initTeam } = await import('./pages/main/init-team');
  //       initTeam();
  //   },
  //   '.main-team'
  // );

  //   useLoadFunction(
  //   async () => {
  //       const { initFAQ } = await import('./pages/main/init-faq');
  //       initFAQ();
  //   },
  //   '.main-faq'
  // );

  
});