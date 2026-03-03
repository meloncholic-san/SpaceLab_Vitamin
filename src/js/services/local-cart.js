import { supabase } from "../api/supabase";

const LOCAL_CART_KEY = 'local_cart';

export function getLocalCart() {
  const cart = localStorage.getItem(LOCAL_CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function saveLocalCart(cart) {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
}

export function addLocalCartProduct(product) {
  const cart = getLocalCart();

  const existing = cart.find(
    item => item.product_id === product.product_id
  );

  if (existing) {
    existing.quantity += product.quantity;
  } else {
    cart.push({
      id: Date.now(),
      ...product
    });
  }

  saveLocalCart(cart);
  return cart;
}

export function updateLocalCartProduct(id, updates) {
  const cart = getLocalCart();
  const item = cart.find(i => String(i.id) === String(id));
  if (!item) return;

  Object.assign(item, updates);
  saveLocalCart(cart);
}

export function deleteLocalCartProduct(id) {
  const cart = getLocalCart();
  const updated = cart.filter(i => String(i.id) !== String(id));
  saveLocalCart(updated);
}


export async function syncLocalCartToDatabase() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const localCart = getLocalCart();
  if (!localCart.length) return;

  for (const item of localCart) {
    await supabase.from('cart').insert({
      product_id: item.product_id,
      user_id: session.user.id,
      quantity: item.quantity,
      is_autoship: item.is_autoship,
      autoship_interval: item.autoship_interval
    });
  }

  localStorage.removeItem('local_cart');
}