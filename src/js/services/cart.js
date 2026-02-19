import { supabase } from '../api/supabase';

export async function getCartProducts() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return
  }
const { data, error } = await supabase
  .from('cart')
  .select(`
    id,
    quantity,
    is_autoship,
    autoship_interval,
    products (
      id,
      title,
      price,
      image,
      category,
      discount,
      package
    )
  `)
  if (error) console.log(error)
  return data;
}


export async function addCartProducts({productId, userId, quantity, autoshipStatus, autoshipInterval}) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    alert('Please sign in to add products to cart')
    return
  }


  const { data, error } = await supabase
    .from('cart')
    .select('id, quantity')
    .eq('product_id', productId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error(error)
    return
  }
  let response;
  if (data) {
    response = await supabase
      .from('cart')
      .update({ quantity: data.quantity + quantity })
      .eq('id', data.id)
      .select()
  } else {
  response = await supabase
      .from('cart')
      .insert({
        product_id: productId,
        user_id: userId,
        quantity: quantity,
        is_autoship: autoshipStatus,
        autoship_interval: autoshipInterval
      })
      .select()
  }
        return { 
          data: response.data, 
          error: response.error 
      }
}



export async function updateCartProduct(cartItemId, newData) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    alert('Please sign in to update cart');
    return { error: 'No session' };
  }

  try {
    const { data, error } = await supabase
      .from('cart')
      .update(newData)
      .eq('id', cartItemId)
      .eq('user_id', session.user.id)
      .select(`
        id,
        quantity,
        is_autoship,
        autoship_interval,
        products (
          id,
          title,
          price,
          image,
          category,
          discount,
          package
        )
      `);

    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating cart product:', error);
    return { data: null, error };
  }
}


export async function deleteCartProduct(cartItemId) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: 'No session' };
  }

  try {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', session.user.id);

    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error('Error deleting cart product:', error);
    return { error };
  }
}