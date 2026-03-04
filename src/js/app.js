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

  if (page === "quiz") {
    const { initQuiz } = await import('./pages/quiz/init-quiz');
    initQuiz();
  }

  
});