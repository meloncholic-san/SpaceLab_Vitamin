import Handlebars from 'handlebars';
import productTemplate from '@html/pages/product/product.hbs?raw';

const template = Handlebars.compile(productTemplate);

const CATEGORY_CLASS_MAP = {
  'Vitamins & Dietary Supplements': 'category--vitamins',
  'Minerals': 'category--minerals',
  'Pain Relief': 'category--pain',
  'Probiotics': 'category--probiotics',
  'Antioxidants': 'category--antioxidants',
  'Weight Loss': 'category--weight-loss',
  'Prenatal Vitamins': 'category--prenatal-vitamins'
};

export function renderProductPage(product) {
  const container = document.querySelector('.product-page__content');
  
      if (product.discount) {
    product.oldPrice = product.price;
    product.price = (
        product.price * (1 - product.discount / 100)
    ).toFixed(2);
    }
  product.categoryClass =
    CATEGORY_CLASS_MAP[product.category] || 'category--default';

  container.innerHTML = template(product);
}