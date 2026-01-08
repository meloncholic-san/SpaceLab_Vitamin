import { getAdvertisementProducts, getProductById } from "../services/products";
import { getQueryParam } from "../utils/url";
import { renderProductPage } from "./product/init-render-product-page";
import { renderProductsCardCatalogue } from "./products/render-products-catalogue";


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
}