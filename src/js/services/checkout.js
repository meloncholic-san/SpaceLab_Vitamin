import { supabase } from '../api/supabase';
import { getCartProducts } from './cart';

export async function createOrderFromCart() {
    const cartItems = await getCartProducts();

    if (!cartItems || cartItems.length === 0) {
        throw new Error("Cart is empty");
    }

    const totalPrice = cartItems.reduce((sum, item) => {
        const product = item.products;
        const price = parseFloat(product.price) || 0;
        const discount = parseFloat(product.discount) || 0;
        const finalPrice = discount > 0 
            ? price * (1 - discount / 100)
            : price;

        return sum + finalPrice * item.quantity;
    }, 0);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            total_price: totalPrice
        })
        .select()
        .single();

    if (orderError) throw orderError;

        console.log("cartItems", cartItems)
    const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.products.id,
        title: item.products.title,
        price: item.products.price,
        discount: item.products.discount,
        quantity: item.quantity,
        is_autoship: item.is_autoship,
        autoship_interval: item.autoship_interval,
        image: item.products.image,
        category: item.products.category
    }));
    console.log("orderItems", orderItems)
    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) throw itemsError;

    await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);

    return order;
}


export async function getOrderWithItems(orderId) {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (*)
        `)
        .eq('id', orderId)
        .single();

    if (error) throw error;

    return data;
}



export async function updateOrderStatus(orderId, status) {
    const { error } = await supabase
        .from('orders')
        .update({
            status,
            updated_at: new Date()
        })
        .eq('id', orderId);

    return { error };
}
