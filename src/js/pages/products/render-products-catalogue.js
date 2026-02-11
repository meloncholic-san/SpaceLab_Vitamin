import Handlebars from 'handlebars';
import productCardTemplate from '@html/components/product-card.hbs?raw';

const template = Handlebars.compile(productCardTemplate);

const CATEGORY_CLASS_MAP = {
  'Vitamins & Dietary Supplements': 'category--vitamins',
  'Minerals': 'category--minerals',
  'Pain Relief': 'category--pain',
  'Probiotics': 'category--probiotics',
  'Antioxidants': 'category--antioxidants',
  'Weight Loss': 'category--weight-loss',
  'Prenatal Vitamins': 'category--prenatal-vitamins'
};

export function renderProductsCardCatalogue (products, container, { append = false } = {}) {
    products = products.map(product => {
        if (product.discount) {
        product.oldPrice = product.price;
        product.price = (
            product.price * (1 - product.discount / 100)
        ).toFixed(2);
        }

        product.categoryClass = CATEGORY_CLASS_MAP[product.category] || 'category--default';

        return product;
    });

    if (products.length <= 2) {
        container.style.marginRight = 'auto';
        container.style.marginLeft = 'auto';
    } else {
        container.style.marginRight = '';
        container.style.marginLeft = '';
    }

    if (products.length === 0) {
        container.innerHTML = '<p style="font-size=20px color=red">No items!</p>'
        return;
    }
    
    console.log(products);

    if (append) {
        container.insertAdjacentHTML('beforeend', products.map(product => template(product)).join(''));
    } else {
        container.innerHTML = products.map(product => template(product)).join('');
    }
}