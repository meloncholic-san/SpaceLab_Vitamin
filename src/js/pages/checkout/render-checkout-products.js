import Handlebars from 'handlebars';
import productOrderTemplate from '@html/pages/checkout/checkout-item.hbs?raw';

const template = Handlebars.compile(productOrderTemplate);


const CATEGORY_CLASS_MAP = {
  'Vitamins & Dietary Supplements': 'category--vitamins',
  'Minerals': 'category--minerals',
  'Pain Relief': 'category--pain',
  'Probiotics': 'category--probiotics',
  'Antioxidants': 'category--antioxidants',
  'Weight Loss': 'category--weight-loss',
  'Prenatal Vitamins': 'category--prenatal-vitamins'
};



export function renderCheckoutProducts(orderItems, container) {
    console.log(orderItems)
    if (!orderItems || !Array.isArray(orderItems)) return;

    const processedItems = orderItems.map(item => {

        const result = {
            id: item.product_id,
            title: item.title,
            image: item.image,
            price: parseFloat(item.price),
            discount: parseFloat(item.discount),
            quantity: item.quantity,
        };

        if (result.discount > 0) {
            result.oldPrice = result.price;
            result.price = (result.price * (1 - result.discount / 100)).toFixed(2);
        }

        result.categoryClass = CATEGORY_CLASS_MAP[item.category] || 'category--default';

        return result;
    });

    if (processedItems.length === 0) {
        container.innerHTML = '<p>Your order is empty</p>';
        return;
    }

    container.innerHTML = processedItems
        .map(product => template(product))
        .join('');

    return processedItems;
}