import { setQueryParam } from "../../utils/url";

export function initProductsFilters(onFilterChange) {
  const buttons = document.querySelectorAll(
    '.products-catalogue__filters-button'
  );

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      setActiveButton(buttons, btn);
      setQueryParam('category', filter);

      onFilterChange(filter);
    });
  });
}

function setActiveButton(buttons, activeBtn) {
  buttons.forEach(btn =>
    btn.classList.toggle(
      'is-active',
      btn === activeBtn
    )
  );
}
