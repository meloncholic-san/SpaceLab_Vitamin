import { supabase } from '../api/supabase';

export async function createSubscriptionsFromOrder(order) {
  const subscriptions = [];

  const startDate = new Date();

  for (const item of order.order_items) {
    if (!item.is_autoship) continue;

    const nextPaymentDate = new Date();
    nextPaymentDate.setDate(
      startDate.getDate() + item.autoship_interval
    );

    subscriptions.push({
      user_id: order.user_id,
      order_id: order.id,
      order_item_id: item.id,
      product_id: item.product_id,

      quantity: item.quantity,
      price_at_purchase: item.price,
      autoship_interval: item.autoship_interval,

      start_date: startDate,
      next_payment_date: nextPaymentDate
    });
  }

  if (!subscriptions.length) return;


    try {
      const { data, error } = await supabase
      .from("subscriptions")
      .insert(subscriptions);
          
      return { data, error };
  } catch (error) {
      return { data, error };
  }
}


export async function getSubscriptionsByUserId(userId) {
    const { data, error } = await supabase
        .from('subscriptions')
        .select(`
            *,
            products:product_id (
                title,
                image,
                category,
                discount
            )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching subscriptions:', error);
        throw error;
    }

    return data.map(sub => ({
        ...sub,
        title: sub.products?.title,
        image: sub.products?.image,
        category: sub.products?.category,
        discount: sub.products?.discount
    }));
}

export async function cancelSubscription(subscriptionId) {
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .update({ 
                status: 'cancelled',
                cancelled_at: new Date()
            })
            .eq('id', subscriptionId)
            .select()
            .single();

        if (error) throw error;
        
        return { data, error: null };
        
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        return { data: null, error };
    }
}