import Handlebars from 'handlebars';
import productOrderTemplate from '@html/pages/profile/profile-subs-item.hbs?raw';
import { cancelSubscription, getSubscriptionsByUserId } from '../../services/subscriptions';

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

function formatNextDelivery(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
}

function getDaySuffix(day) {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

function renderSubscriptions(subscriptions, container) {
    if (!subscriptions || subscriptions.length === 0) {
        container.innerHTML = '<p class="profile-subs__empty">You have no active subscriptions</p>';
        return [];
    }

    const processedItems = subscriptions.map(sub => {
        const result = {
            id: sub.product_id,
            subscriptionId: sub.id,
            title: sub.title,
            image: sub.image,
            price: (parseFloat(sub.price_at_purchase) * sub.quantity).toFixed(2),
            quantity: sub.quantity,
            autoship_interval: `Shipment every ${sub.autoship_interval} days`,
            autoship_next: formatNextDelivery(sub.next_payment_date),
            category: sub.category
        };

        result.categoryClass = CATEGORY_CLASS_MAP[sub.category] || 'category--default';
        return result;
    });

    container.innerHTML = processedItems
        .map(item => template(item))
        .join('');

    return processedItems;
}


async function refreshSubscriptions(userId, container) {
    try {
        const subscriptions = await getSubscriptionsByUserId(userId);
        renderSubscriptions(subscriptions, container);

        return subscriptions;
        
    } catch (error) {
        console.error('Error refreshing subscriptions:', error);
        container.innerHTML = '<p class="profile-subs__error">Failed to load subscriptions</p>';
        return [];
    }
}


function attachUnsubscribeHandlers(container, userId) {
    const unsubscribeBtns = container.querySelectorAll('.profile-subs-items__btn');
    
    unsubscribeBtns.forEach(btn => {
        const oldHandler = btn.clickHandler;
        if (oldHandler) {
            btn.removeEventListener('click', oldHandler);
        }
        
        const handler = async (e) => {
            e.preventDefault();
            const subscriptionId = btn.dataset.subscriptionId;
            const subscriptionItem = btn.closest('.profile-subs-items');
            
            if (confirm('Are you sure you want to unsubscribe?')) {
                try {
                    btn.disabled = true;
                    const originalText = btn.textContent;
                    btn.textContent = 'Processing...';
                    const result = await cancelSubscription(subscriptionId);
                    
                    if (result.error) {
                        throw new Error(result.error.message);
                    }
                    btn.disabled = false;
                    btn.textContent = originalText;
                    await animateUnsubscribe(subscriptionItem);

                } catch (error) {
                    console.error('Error unsubscribing:', error);
                    btn.disabled = false;
                    btn.textContent = 'Unsubscribe';
                }
            }
        };
        
        btn.clickHandler = handler;
        btn.addEventListener('click', handler);
    });
}


function animateUnsubscribe(element) {
    return new Promise(resolve => {
        element.style.transition = 'all 0.3s ease';
        element.style.opacity = '0';
        element.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            element.remove();
            resolve();
        }, 300);
    });
}


export async function initProfileSubs(userId) {
    const container = document.querySelector('.profile-subs__list');
    if (!container) return;

    try {
        await refreshSubscriptions(userId, container);
    
        attachUnsubscribeHandlers(container, userId);

    } catch (error) {
        console.error('Error loading subscriptions:', error);
        container.innerHTML = '<p class="profile-subs__error">Failed to load subscriptions</p>';
    }
}