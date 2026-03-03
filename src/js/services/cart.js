import { supabase } from '../api/supabase';
import {
  getLocalCart,
  addLocalCartProduct,
  updateLocalCartProduct,
  deleteLocalCartProduct
} from './local-cart';


export async function addCartProducts({product,quantity,autoshipStatus,autoshipInterval}) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const cart = addLocalCartProduct({
      product_id: product.id,
      quantity,
      is_autoship: autoshipStatus,
      autoship_interval: autoshipInterval,
      products: {
        price: product.price,
        discount: product.discount,
        title: product.title,
        image: product.image,
        category: product.category
      }
    });

    return { data: cart, error: null };
  }

  const userId = session.user.id;

  const { data, error } = await supabase
    .from('cart')
    .select('id, quantity')
    .eq('product_id', product.id)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) return { error };

  if (data) {
    await supabase
      .from('cart')
      .update({ quantity: data.quantity + quantity })
      .eq('id', data.id);
  } else {
    await supabase
      .from('cart')
      .insert({
        product_id: product.id,
        user_id: userId,
        quantity,
        is_autoship: autoshipStatus,
        autoship_interval: autoshipInterval
      });
  }

  return { error: null };
}


export async function getCartProducts() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return getLocalCart();
  }

  const { data, error } = await supabase
    .from('cart')
    .select('*, products(*)')
    .eq('user_id', session.user.id);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}


export async function updateCartProduct(id, updates) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    updateLocalCartProduct(id, updates);
    return { error: null };
  }

  const { error } = await supabase
    .from('cart')
    .update(updates)
    .eq('id', id);

  return { error };
}


export async function deleteCartProduct(id) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    deleteLocalCartProduct(id);
    return;
  }

  await supabase
    .from('cart')
    .delete()
    .eq('id', id);
}