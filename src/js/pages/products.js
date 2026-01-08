import { getProducts } from '../services/products';
import { initProductsBanners } from './products/init-products-banners';
import { renderProductsCardCatalogue } from './products/render-products-catalogue';
import { getQueryParam } from '../utils/url';
import { initProductsFilters } from './products/init-products-filter';
import { setButtonLoading } from '../utils/set-buttonLoading';
import { initProductsMobileFilter } from './products/init-products-mobile-filters';
import { initReviews } from '../components/init-reviews';

export async function initProducts() {
  initProductsBanners();

  const container = document.querySelector('.products-catalogue__items');
  const loadMoreBtn = document.querySelector(
    '.products-catalogue__load-more-btn'
  );

  let page = 1;
  let currentCategory = getQueryParam('category') || 'all';
  document.querySelector(`[data-filter="${currentCategory}"]`)?.classList.add('is-active');
  const mobileLabel = document.querySelector('.products-catalogue__mobile-filter-label');
  const activeMobileBtn = document.querySelector(`.products-catalogue__mobile-filter-dropdown [data-filter="${currentCategory}"]`);

  if (mobileLabel && activeMobileBtn) {
    mobileLabel.textContent = activeMobileBtn.textContent;
  }

  async function loadProducts({ reset = false } = {}) {
    setButtonLoading(true, loadMoreBtn);

    if (reset) {
      page = 1;
      container.innerHTML = '';
    }

    const products = await getProducts({
      category: currentCategory,
      page,
    });

    renderProductsCardCatalogue(products, container, {
      append: !reset,
    });

    loadMoreBtn.style.display =
      products.length < 6 ? 'none' : 'block';

    setButtonLoading(false, loadMoreBtn);
  }

  await loadProducts({ reset: true });

  initProductsFilters(async category => {
    currentCategory = category;
    await loadProducts({ reset: true });
  });

  initProductsMobileFilter(async category => {
    currentCategory = category;

    document
      .querySelectorAll('.products-catalogue__filters-button')
      .forEach(btn =>
        btn.classList.toggle(
          'is-active',
          btn.dataset.filter === category
        )
      );

    await loadProducts({ reset: true });
  });

  loadMoreBtn.addEventListener('click', async () => {
    page += 1;
    await loadProducts();
  });

  initReviews();
}
