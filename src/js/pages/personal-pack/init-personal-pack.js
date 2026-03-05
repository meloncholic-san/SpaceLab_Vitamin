import { getRandomProducts } from "../../services/products";
import { renderProductsCardCatalogue } from "../products/render-products-catalogue";
import { addCartProducts, getCartProducts } from '../../services/cart';
import { updateCartButtons } from '../../components/init-cart';
import { showToast } from '../../components/show-toast';

function attachPersonalPackHandler(products) {
  const btn = document.querySelector('.personal-pack-catalogue__btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Adding...';

    try {
      const errors = [];

      for (const product of products) {
        const { error } = await addCartProducts({
          product,
          quantity: 1,
          autoshipStatus: false,
          autoshipInterval: null
        });

        if (error) errors.push(error);
      }

      if (errors.length > 0) {
        throw new Error('Some products failed');
      }

      showToast('Personalized pack added to cart!', 'success');

      const cartItems = await getCartProducts();
      updateCartButtons(cartItems);

    } catch (error) {
      console.error(error);
      showToast('Failed to add products', 'error');
    }

    btn.disabled = false;
    btn.textContent = originalText;
  });
}


export async function initPersonalPack() {
  const title = document.querySelector(".personal-pack-hero__title");
  if (!title) return;

  const storedData = localStorage.getItem("quizData");
  if (!storedData) {
    window.location.href = "./quiz.html";
    return;
  }

  const data = JSON.parse(storedData);
  const name = data.firstName?.trim();

  if (name) {
    title.textContent = `${name}, we made personalized pack for you!`;
  }

  const productsContainer = document.querySelector(".personal-pack-catalogue__items");
  if (!productsContainer) return;

  try {
    const products = await getRandomProducts({ limit: 4 });
    renderProductsCardCatalogue(products, productsContainer);
    attachPersonalPackHandler(products);
  } catch (err) {
    console.error("Failed to load random products:", err);
  }
}