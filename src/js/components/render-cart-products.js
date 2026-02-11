import Handlebars from 'handlebars';
import productCartTemplate from '@html/components/cart-product.hbs?raw';

const template = Handlebars.compile(productCartTemplate);


const CATEGORY_CLASS_MAP = {
  'Vitamins & Dietary Supplements': 'category--vitamins',
  'Minerals': 'category--minerals',
  'Pain Relief': 'category--pain',
  'Probiotics': 'category--probiotics',
  'Antioxidants': 'category--antioxidants',
  'Weight Loss': 'category--weight-loss',
  'Prenatal Vitamins': 'category--prenatal-vitamins'
};


export function renderCartProducts(cartItems, container) {
    if (!cartItems || !Array.isArray(cartItems)) return;
    
    const processedItems = cartItems.map(cartItem => {
        const product = cartItem.products || {};
        
        const result = {
            id: product.id, 
            title: product.title,
            image: product.image,
            price: product.price,
            discount: product.discount,
            category: product.category,
            
            quantity: cartItem.quantity,
            is_autoship: cartItem.is_autoship,
            autoship_interval: cartItem.autoship_interval,
            cartId: cartItem.id

        };
        
        if (result.discount) {
            result.oldPrice = result.price;
            result.price = (result.price * (1 - result.discount / 100)).toFixed(2);
        }
        
        result.categoryClass = CATEGORY_CLASS_MAP[product.category] || 'category--default';


        result.autoship_options_html = `
        <option value="30" ${result.autoship_interval == "30" ? 'selected' : ''}>30</option>
        <option value="60" ${result.autoship_interval == "60" ? 'selected' : ''}>60</option>
        <option value="90" ${result.autoship_interval == "90" ? 'selected' : ''}>90</option>
    `;


        return result;
    });



    if (processedItems.length === 0) {
        container.innerHTML = '<div class="cart__no-items-wrapper"><p class="cart__no-items">Your cart is empty!</p></div>';
        return;
    }
    
    console.log('Processed cart items:', processedItems);
    container.innerHTML = processedItems.map(product => template(product)).join('');
    return processedItems;
}