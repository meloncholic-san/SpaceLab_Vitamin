import Handlebars from 'handlebars';
import orderTemplate from '@html/pages/profile/profile-orders-item.hbs?raw';
import { showToast } from '../../components/show-toast';
import { getOrdersByUserId, reorderItems } from '../../services/profile';
import { getCartProducts } from "../../services/cart";
import { updateCartButtons } from '../../components/init-cart';

const template = Handlebars.compile(orderTemplate);

const CATEGORY_CLASS_MAP = {
    'Vitamins & Dietary Supplements': 'category--vitamins',
    'Minerals': 'category--minerals',
    'Pain Relief': 'category--pain',
    'Probiotics': 'category--probiotics',
    'Antioxidants': 'category--antioxidants',
    'Weight Loss': 'category--weight-loss',
    'Prenatal Vitamins': 'category--prenatal-vitamins'
};

function formatOrderDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
}



function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function renderOrders(orders, container) {
    if (!orders || orders.length === 0) {
        container.innerHTML = '<p class="profile-orders__empty">You have no orders yet</p>';
        return [];
    }

    const processedOrders = orders.map(order => {
        console.log(order)
        const items = order.order_items.map(item => ({
            category: item?.category || 'Unknown',
            categoryClass: CATEGORY_CLASS_MAP[item?.category] || 'category--default',
            title: item?.title || 'Product',
            quantity: item.quantity,
            price: (parseFloat(item.price) * item.quantity).toFixed(2),
            image: item.image,

        }));

        return {
            orderId: order.id,
            orderDate: formatOrderDate(order.created_at),
            orderNumber: order.id,
            items: items,
            totalAmount: parseFloat(order.total_price).toFixed(2),
            status: capitalizeFirstLetter(order.status),
        };
    });
    console.log(processedOrders)
    container.innerHTML = processedOrders
        .map(order => template(order))
        .join('');

    return processedOrders;
}

function attachReorderHandlers(container) {
    const reorderBtns = container.querySelectorAll('.profile-order-item__btn-reorder');
    
    reorderBtns.forEach(btn => { 
        const handler = async (e) => {
            e.preventDefault();
            const orderId = btn.dataset.orderId;
            
            btn.disabled = true;
            const originalText = btn.textContent;
            btn.textContent = 'Adding...';
            
            try {
                const result = await reorderItems(orderId);
                console.log(result)
                if (result.error) {
                    throw new Error(result.error.message);
                }
                showToast('Items added to cart successfully!', 'success');
                const cartItems = await getCartProducts();
                updateCartButtons(cartItems);

                btn.disabled = false;
                btn.textContent = originalText;
            } catch (error) {
                console.error('Error reordering:', error);
                showToast('Failed to add items to cart', 'error');
                
                btn.disabled = false;
                btn.textContent = originalText;
            }
        };
        btn.addEventListener('click', handler);
    });
}

export async function initProfileOrders(userId) {
    const container = document.querySelector('.profile-order__list');
    if (!container) return;

    try {
        const orders = await getOrdersByUserId(userId);
        console.log(orders)
        renderOrders(orders, container);
        attachReorderHandlers(container);
        
    } catch (error) {
        console.error('Error loading orders:', error);
        container.innerHTML = '<p class="profile-orders__error">Failed to load orders</p>';
    }
}