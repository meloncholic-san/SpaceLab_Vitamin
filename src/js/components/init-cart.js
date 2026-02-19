
import { updateCartProduct, deleteCartProduct, getCartProducts } from "../services/cart";
import { renderCartProducts } from "./render-cart-products";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import scrollLock from 'scroll-lock';
import { createOrderFromCart } from "../services/checkout";


let currentCartContainer = null;

function lockBodyScroll() {
    scrollLock.disablePageScroll(document.body);
    document.body.classList.add('scroll-locked');
}

function unlockBodyScroll() {
    scrollLock.enablePageScroll(document.body);
    document.body.classList.remove('scroll-locked');
}

const clickHandler = async (e) => {
    const target = e.target;
    
    if (target.classList.contains('cart-product-btn-plus')) {
        await handlePlusButton(target);
    }
    
    if (target.classList.contains('cart-product-btn-menus')) {
        await handleMinusButton(target);
    }
};

const changeHandler = async (e) => {
    const target = e.target;
    
    if (target.classList.contains('cart-product__autoship-checkbox')) {
        await handleAutoshipCheckbox(target);
    }
    
    if (target.classList.contains('cart-product__autoship-select')) {
        await handleAutoshipSelect(target);
    }
};


function setupCartItemHandlers(container) {
    if (!container) return;
    
    container.removeEventListener('click', clickHandler);
    container.removeEventListener('change', changeHandler);
    
    container.addEventListener('click', clickHandler);
    container.addEventListener('change', changeHandler);
    
    console.log('✅ Handlers attached to:', container);
}

function removeCartItemHandlers(container) {
    if (!container) return;
    
    container.removeEventListener('click', clickHandler);
    container.removeEventListener('change', changeHandler);
    
    console.log('🧹 Handlers removed from:', container);
}


async function handlePlusButton(button) {
    const cartItem = button.closest('.cart-product');
    if (!cartItem) return;
    
    const cartItemId = cartItem.dataset.cardid;
    const countElement = cartItem.querySelector('.cart-product__count');
    
    if (!cartItemId || !countElement) return;
    
    const currentCount = parseInt(countElement.textContent) || 1;
    const newCount = currentCount + 1;
    
    button.disabled = true;
    button.classList.add('loading');
    
    try {
        countElement.textContent = newCount;
        const result = await updateCartProduct(cartItemId, { quantity: newCount });
        if (result.error) throw result.error;
        await updateCartTotal();
    } catch (error) {
        countElement.textContent = currentCount;
        console.error('Error increasing quantity:', error);
        showToast('Failed to update quantity', 'error');
        
    } finally {
        button.disabled = false;
        button.classList.remove('loading');
    }
}

async function handleMinusButton(button) {
    const cartItem = button.closest('.cart-product');
    if (!cartItem) return;
    
    const cartItemId = cartItem.dataset.cardid;
    const countElement = cartItem.querySelector('.cart-product__count');
    
    if (!cartItemId || !countElement) return;
    
    const currentCount = parseInt(countElement.textContent) || 1;
    

    if (currentCount <= 1) {
        cartItem.classList.add('removing');
        
        if (await confirmRemove()) {
            try {
                button.disabled = true;
                button.classList.add('loading');
                
                await deleteCartProduct(cartItemId);
                
                cartItem.style.height = `${cartItem.offsetHeight}px`;
                cartItem.style.transition = 'all 0.3s ease';
                cartItem.style.opacity = '0';
                cartItem.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    refreshCart();
                }, 300);
                
            } catch (error) {
                console.error('Error removing item:', error);
                cartItem.classList.remove('removing');
                showToast('Failed to remove item', 'error');
            }
        } else {
            cartItem.classList.remove('removing');
        }
        return;
    }
    
    const newCount = currentCount - 1;
    
    button.disabled = true;
    button.classList.add('loading');
    
    try {
        countElement.textContent = newCount;
        
        const result = await updateCartProduct(cartItemId, { quantity: newCount });
        
        if (result.error) throw result.error;
        
        await updateCartTotal();
        
    } catch (error) {
        countElement.textContent = currentCount;
        console.error('Error decreasing quantity:', error);
        showToast('Failed to update quantity', 'error');
        
    } finally {
        button.disabled = false;
        button.classList.remove('loading');
    }
}


async function handleAutoshipCheckbox(checkbox) {
    const cartItemId = checkbox.dataset.cartId;
    const isChecked = checkbox.checked;
    
    if (!cartItemId) return;
    
    const container = checkbox.closest('.cart__body');
    const select = container?.querySelector(`.cart-product__autoship-select[data-cart-id="${cartItemId}"]`);
    
    checkbox.disabled = true;
    checkbox.classList.add('loading');
    
    try {
        if (select) {
            select.disabled = !isChecked;
        }
        const result = await updateCartProduct(cartItemId, { 
            is_autoship: isChecked,
            autoship_interval: isChecked ? (select?.value || 30) : null
        });
        
        if (result.error) throw result.error;
        showToast(isChecked ? 'Autoship enabled' : 'Autoship disabled', 'success');
        
    } catch (error) {
        checkbox.checked = !isChecked;
        if (select) {
            select.disabled = isChecked;
        }
        console.error('Error updating autoship:', error);
        showToast('Failed to update autoship', 'error');
        
    } finally {
        checkbox.disabled = false;
        checkbox.classList.remove('loading');
    }
}

async function handleAutoshipSelect(select) {
    const cartItemId = select.dataset.cartId;
    const interval = parseInt(select.value);
    
    if (!cartItemId || !interval) return;
    
    const previousValue = select.dataset.previousValue || select.value;
    select.dataset.previousValue = select.value;
    
    select.disabled = true;
    select.classList.add('loading');
    
    try {
        const result = await updateCartProduct(cartItemId, { 
            autoship_interval: interval 
        });
        
        if (result.error) throw result.error;
        
        showToast(`Autoship interval updated to ${interval} days`, 'success');
        
    } catch (error) {
        select.value = previousValue;
        console.error('Error updating autoship interval:', error);
        showToast('Failed to update interval', 'error');
        
    } finally {
        select.disabled = false;
        select.classList.remove('loading');
    }
}

export function openCart(cartBtn) {
    // const cartBtn = document.querySelector(".header__content-cart-btn");
    const cartContainer = document.querySelector(".cart");
    
    if (!cartBtn || !cartContainer) return;
    
    cartBtn.removeEventListener('click', handleOpenCart);
    cartBtn.addEventListener('click', handleOpenCart);
}

function handleOpenCart(e) {
    e.preventDefault();
    const cartContainer = document.querySelector(".cart");
    if (!cartContainer) return;
    
    cartContainer.classList.add("active");
    lockBodyScroll();
    refreshCart();
}

export function closeCart() {
    const cartBtnClose = document.querySelector(".cart__btn-close");
    const cartContainer = document.querySelector(".cart");
    const cartOverlay = document.querySelector(".cart__overlay");
    
    if (!cartBtnClose || !cartContainer) return;
    
    cartBtnClose.removeEventListener('click', handleCloseCart);
    cartBtnClose.addEventListener('click', handleCloseCart);
    
    if (cartOverlay) {
        cartOverlay.removeEventListener('click', handleCloseCart);
        cartOverlay.addEventListener('click', handleCloseCart);
    }
    
    document.removeEventListener('keydown', handleEscapeKey);
    document.addEventListener('keydown', handleEscapeKey);
}

function handleCloseCart() {
    const cartContainer = document.querySelector(".cart");
    if (cartContainer) {
        cartContainer.classList.remove("active");
        unlockBodyScroll();
        const cartBody = document.querySelector('.cart__body');
        if (cartBody) {
            removeCartItemHandlers(cartBody);
            currentCartContainer = null;
        }
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        const cartContainer = document.querySelector(".cart");
        if (cartContainer?.classList.contains('active')) {
            handleCloseCart();
            unlockBodyScroll();
        }
    }
}


export function updateCartButtons(cartItems) {
    const hasItems = cartItems && cartItems.length > 0;
    
    const cartBtnDefault = document.querySelector('.header__content-cart-btn:not(.alert):not(.white):not(.white-alert)');
    const cartBtnAlert = document.querySelector('.header__content-cart-btn.alert');
    const cartBtnWhite = document.querySelector('.header__content-cart-btn.white');
    const cartBtnWhiteAlert = document.querySelector('.header__content-cart-btn.white-alert');
    const cartOrderBtn = document.querySelector('.cart__order-btn');
    cartOrderBtn.disabled = !hasItems;

    const isWhiteVisible = cartBtnWhite && window.getComputedStyle(cartBtnWhite).display !== 'none';
    

    if (cartBtnDefault) cartBtnDefault.style.display = 'none';
    if (cartBtnAlert) cartBtnAlert.style.display = 'none';
    if (cartBtnWhite) cartBtnWhite.style.display = 'none';
    if (cartBtnWhiteAlert) cartBtnWhiteAlert.style.display = 'none';
    
    let activeButton = null;
    
    if (isWhiteVisible) {
        if (hasItems && cartBtnWhiteAlert) {
            cartBtnWhiteAlert.style.display = 'block';
            activeButton = cartBtnWhiteAlert;
        } else if (!hasItems && cartBtnWhite) {
            cartBtnWhite.style.display = 'block';
            activeButton = cartBtnWhite;
        }
    } else {
        if (hasItems && cartBtnAlert) {
            cartBtnAlert.style.display = 'block';
            activeButton = cartBtnAlert;
        } else if (!hasItems && cartBtnDefault) {
            cartBtnDefault.style.display = 'block';
            activeButton = cartBtnDefault;
        }
    }
    
    [cartBtnDefault, cartBtnAlert, cartBtnWhite, cartBtnWhiteAlert].forEach(btn => {
        if (btn) btn.removeEventListener('click', handleOpenCart);
    });
    

    if (activeButton) {
        activeButton.addEventListener('click', handleOpenCart);
        openCart(activeButton);
        console.log('🎯 Active cart button:', activeButton.className);
    }
    
    return activeButton;
}

export async function refreshCart() {
    try {
        const cartItems = await getCartProducts();
        const cartProductList = document.querySelector('.cart__body');
        
        if (!cartProductList) return;
        
        if (currentCartContainer) {
            removeCartItemHandlers(currentCartContainer);
            currentCartContainer = null;
        }
        
        renderCartProducts(cartItems, cartProductList);
        setupCartItemHandlers(cartProductList);
        currentCartContainer = cartProductList;
        await updateCartTotal();
        
        updateCartButtons(cartItems);
        
        return cartItems;
    } catch (error) {
        console.error('Error refreshing cart:', error);
    }
}

export async function updateCartTotal() {
    try {
        const cartItems = await getCartProducts();
        console.log(cartItems)
        const cartOrderBtn = document.querySelector('.cart__order-btn');
        
        if (!cartOrderBtn) return 0;
        
        let totalPrice = 0;
        
        if (cartItems && cartItems.length > 0) {
            totalPrice = cartItems.reduce((sum, cartItem) => {
                const product = cartItem.products || {};
                const price = parseFloat(product.price) || 0;
                const discount = parseFloat(product.discount) || 0;
                const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
                const quantity = parseInt(cartItem.quantity) || 0;
                
                return sum + (finalPrice * quantity);
            }, 0);
        }
        
        cartOrderBtn.innerHTML = `Check Out <span class="cart__order-btn-dot">•</span> $${totalPrice.toFixed(2)}`;
        
        return totalPrice;
        
    } catch (error) {
        console.error('Error updating total price:', error);
        return 0;
    }
}



async function confirmRemove() {
    return confirm('Remove this item from cart?');
}

function showToast(message, type = 'info', duration = 3000) {
    const options = {
        text: message,
        duration: duration,
        close: true,
        gravity: "top", 
        position: "center",
        stopOnFocus: true,
        style: {}
    };
    

    switch(type) {
        case 'success':
            options.style = {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            };
            break;
        case 'error':
            options.style = {
                background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            };
            break;
        case 'warning':
            options.style = {
                background: "linear-gradient(to right, #f7971e, #ffd200)",
            };
            break;
        default:
            options.style = {
                background: "linear-gradient(to right, #6B5EBB, #91CAF2)",
            };
    }
    
    Toastify(options).showToast();
}

export function setupCheckoutButton() {
    const btn = document.querySelector('.cart__order-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.textContent = 'Processing...';

        try {
            const order = await createOrderFromCart();

            window.location.href = `/checkout.html?order=${order.id}`;

        } catch (error) {
            console.error(error);
            showToast('Checkout failed', 'error');
        } finally {
            btn.disabled = false;
        }
    });
}

export async function initCart() {
    try {        
        const cartItems = await refreshCart();
        setupCheckoutButton();
        closeCart();
    } catch (error) {
        console.error('Error initializing cart:', error);
    }
}