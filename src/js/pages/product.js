import { getCurrentSession } from "../services/auth";
import { addCartProducts } from "../services/cart";
import { getAdvertisementProducts, getProductById } from "../services/products";
import { getQueryParam } from "../utils/url";
import { renderProductPage } from "./product/init-render-product-page";
import { renderProductsCardCatalogue } from "./products/render-products-catalogue";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";


function showSuccessToast() {
    Toastify({
        text: "✅ Added this product to the cart!",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { 
            background: "linear-gradient(to right, #00b09b, #96c93d)",
            borderRadius: "8px",
            fontSize: "14px",
            padding: "12px 20px",
        },
        stopOnFocus: true
    }).showToast();
}

function showErrorToast() {
    Toastify({
        text: "❌ Failed to add product to cart",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { 
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            borderRadius: "8px",
            fontSize: "14px",
            padding: "12px 20px",
        },
        stopOnFocus: true
    }).showToast();
}


export async function initProduct () {
    const productId = getQueryParam('id');

    if (!productId) {
        console.error('Product ID not found');
        return;
    }

    const product = await getProductById(productId);
    renderProductPage(product);

    const productsContainer = document.querySelector(".product-advertisement__items")
    const advertisementProducts = await getAdvertisementProducts({category: product.category, excludeId: product.id, limit: 4});
    renderProductsCardCatalogue(advertisementProducts,productsContainer);


    const backlink = document.querySelector('.product__backlink');
    localStorage.setItem('productsPageUrl', document.referrer || '/products');
    
    backlink.addEventListener('click', (e) => {
        e.preventDefault();
        const savedUrl = localStorage.getItem('productsPageUrl') || '/products';
        window.location.href = savedUrl;
    });


    const quantityBtnPlusRef = document.querySelector('.product__cart-btn-plus');
    const quantityBtnMenusRef = document.querySelector('.product__cart-btn-menus');
    const quantityCountRef = document.querySelector('.product__cart-count');
    let currentPriceRef = document.querySelector('.product__price--regular');

    if (!currentPriceRef) {
        currentPriceRef = document.querySelector('.product__price--new');
    }

    const autoshipCheckbox = document.querySelector('.product__autoship-checkbox');
    const autoshipContainer = document.querySelector('.product__autoship');
    let autoshipStatus = autoshipCheckbox.checked;

    autoshipCheckbox.addEventListener('change', e => {
        autoshipStatus = e.target.checked;
        if (autoshipStatus) {
            autoshipContainer.classList.add('product__autoship--active');
            console.log(autoshipStatus)
        } else {
            autoshipContainer.classList.remove('product__autoship--active');
            console.log(autoshipStatus)
        }
    });
    
    const autoshipFrequencyRef = document.querySelector('.product__autoship-select');
    // FOR TESTING
    autoshipFrequencyRef.addEventListener('change', e => {
        console.log(autoshipFrequencyRef.value)
    })

    const basePriceText = currentPriceRef.textContent;
    const basePrice = parseFloat(basePriceText.replace('$', '').trim()); 
    let currentQuantity = 1;

    quantityBtnPlusRef.addEventListener('click', () => {
        currentQuantity += 1;
        quantityCountRef.textContent = currentQuantity;
        const totalPrice = basePrice * currentQuantity;
        currentPriceRef.textContent = `$${totalPrice.toFixed(2)}`;
    });

    quantityBtnMenusRef.addEventListener('click', () => {
        if (currentQuantity > 1) { 
            currentQuantity -= 1;
            quantityCountRef.textContent = currentQuantity;
        }
        const totalPrice = basePrice * currentQuantity;
        currentPriceRef.textContent = `$${totalPrice.toFixed(2)}`;
    });




    const addToCartBtn = document.querySelector('.product__order-btn');


    const { data: { session } } = await getCurrentSession();
    const user = session?.user?.id;

    addToCartBtn.addEventListener('click', async () => {

    const result = await addCartProducts({
                productId: product.id,
                userId: user,
                quantity: currentQuantity,
                autoshipStatus: autoshipStatus,
                autoshipInterval: autoshipStatus ? autoshipFrequencyRef.value : null
            });
            console.log(result)
            if (result && !result.error) {
                showSuccessToast();
            } else {
                showErrorToast();
            }
    })
}