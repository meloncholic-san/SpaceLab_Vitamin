import { setQueryParam } from '../../utils/url';

export function initProductsMobileFilter(onFilterChange) {
  const container = document.querySelector('.products-catalogue__mobile-filter');
  if (!container) return;

  const trigger = container.querySelector('.products-catalogue__mobile-filter-trigger');
  const label = container.querySelector('.products-catalogue__mobile-filter-label');
  const buttons = container.querySelectorAll('[data-filter]');

  trigger.addEventListener('click', () => {
    container.classList.toggle('is-open');
  });

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;

      label.textContent = btn.textContent;
      container.classList.remove('is-open');

      setQueryParam('category', category);
      onFilterChange(category);
    });
  });

  document.addEventListener('click', e => {
    if (!container.contains(e.target)) {
      container.classList.remove('is-open');
    }
  });
}
