import { supabase } from '../api/supabase';
import { getCurrentUser } from './auth';


export async function saveShippingData(shippingData) {
    const { data: { user } } = await getCurrentUser();

    if (!user) return;

    try {
        const response = await supabase
            .from('shipping_addresses')
            .upsert({
                user_id: user.id,
                first_name: shippingData.firstName?.trim(),
                last_name: shippingData.lastName?.trim(),
                address1: shippingData.address1?.trim(),
                address2: shippingData.address2?.trim(),
                city: shippingData.city?.trim(),
                state: shippingData.state,
                zip: shippingData.zip?.trim(),
                phone: shippingData.phone?.trim(),
                email: shippingData.email?.trim(),
                updated_at: new Date()
            }, {
                onConflict: 'user_id',
                ignoreDuplicates: false
            });

        return response;

    } catch (error) {
        console.error(error);
    }
}


export async function saveBillingData(billingData) {
    const { data: { user } } = await getCurrentUser();

    if (!user) return;

    try {
      const [month, year] = billingData.expiry.split('/');

        const response = await supabase
            .from('billing_profiles')
            .upsert({
                user_id: user.id,
                card_number: billingData.cardNumber?.trim(),
                expiry_month: parseInt(month),
                expiry_year: parseInt(year),
                cvc: billingData.cvc?.trim(),
                updated_at: new Date()
            }, {
                onConflict: 'user_id',
                ignoreDuplicates: false
            });

        return response;

    } catch (error) {
        console.error(error);
    }
}



export async function getShippingData() {
    const { data: { user } } = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('shipping_addresses')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error) return null;

    return data;
}


export async function getBillingData() {
    const { data: { user } } = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('billing_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error) return null;

    return data;
}



export async function getOrdersByUserId(userId) {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            id,
            created_at,
            total_price,
            status,
            order_items (
                id,
                title,
                price,
                discount,
                quantity,
                is_autoship,
                autoship_interval,
                image,
                category
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }

    return data;
}

export async function reorderItems(orderId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { error: { message: 'Please sign in' } };
    }

    try {
        const { data: orderItems, error: fetchError } = await supabase
            .from('order_items')
            .select('product_id, quantity, is_autoship, autoship_interval')
            .eq('order_id', orderId);

        if (fetchError) throw fetchError;
        if (!orderItems || orderItems.length === 0) {
            return { error: { message: 'No items in order' } };
        }

        console.log('Reordering items:', orderItems);

        const results = [];
        const errors = [];

        for (const item of orderItems) {
            const { data: existing } = await supabase
                .from('cart')
                .select('id, quantity')
                .eq('product_id', item.product_id)
                .eq('user_id', session.user.id)
                .maybeSingle();

            let result;
            
            if (existing) {
                result = await supabase
                    .from('cart')
                    .update({ 
                        quantity: existing.quantity + item.quantity,
                        updated_at: new Date()
                    })
                    .eq('id', existing.id)
                    .select();
            } else {
                result = await supabase
                    .from('cart')
                    .insert({
                        product_id: item.product_id,
                        user_id: session.user.id,
                        quantity: item.quantity,
                        is_autoship: item.is_autoship || false,
                        autoship_interval: item.autoship_interval || null
                    })
                    .select();
            }

            if (result.error) {
                errors.push(result.error);
            } else {
                results.push(result.data);
            }
        }

        if (errors.length > 0) {
            console.error('Some items failed:', errors);
            return { 
                data: results, 
                error: { 
                    message: `${errors.length} items failed to add` 
                } 
            };
        }

        return { data: results, error: null };

    } catch (error) {
        console.error('Error in reorderItems:', error);
        return { data: null, error };
    }
}