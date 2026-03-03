import { guestSupabase, supabase } from '../api/supabase';
import { getCartProducts } from './cart';
import { getLocalCart } from './local-cart';
import { getGuestId } from './guest';

async function getClient() {
    const { data: { user } } = await supabase.auth.getUser();
    return user ? supabase : guestSupabase;
}

export async function createOrderFromCart() {
    const { data: { user } } = await supabase.auth.getUser();

    const cartItems = user
        ? await getCartProducts()
        : getLocalCart();

    if (!cartItems?.length) {
        throw new Error("Cart is empty");
    }

    const totalPrice = cartItems.reduce((sum, item) => {
        const product = item.products || item;
        const price = parseFloat(product.price) || 0;
        const discount = parseFloat(product.discount) || 0;

        const finalPrice = discount > 0
            ? price * (1 - discount / 100)
            : price;

        return sum + finalPrice * item.quantity;
    }, 0);

    const client = user ? supabase : guestSupabase;

    const { data: order, error: orderError } = await client
        .from('orders')
        .insert({
            user_id: user ? user.id : null,
            guest_id: user ? null : getGuestId(),
            total_price: totalPrice,
        })
        .select()
        .single();

    if (orderError) throw orderError;

    const orderItems = cartItems.map(item => {
        const product = item.products || item;

        return {
            order_id: order.id,
            product_id: product.id || item.product_id,
            title: product.title,
            price: product.price,
            discount: product.discount,
            quantity: item.quantity,
            is_autoship: item.is_autoship,
            autoship_interval: item.autoship_interval,
            image: product.image,
            category: product.category
        };
    });

    const { error: itemsError } = await client
        .from('order_items')
        .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
}

export async function getOrderWithItems(orderId) {
    const client = await getClient();

    const { data, error } = await client
        .from('orders')
        .select(`
            *,
            order_items (*)
        `)
        .eq('id', orderId)
        .maybeSingle();

    if (error) throw error;

    return data;
}

export async function updateOrderStatus(orderId, status) {
    const client = await getClient();

    const { error } = await client
        .from('orders')
        .update({
            status,
            updated_at: new Date()
        })
        .eq('id', orderId);

    return { error };
}