import { supabase } from '../api/supabase';

export async function createSubscriptionsFromOrder(order) {
  if (!order?.order_items?.length) {
    return { data: null, error: null };
  }

  const startDate = new Date();
  const autoshipItems = order.order_items.filter(item => item.is_autoship);
  
  if (!autoshipItems.length) {
    return { data: null, error: null };
  }

  const { data: existingSubs } = await supabase
    .from('subscriptions')
    .select('product_id')
    .eq('user_id', order.user_id)
    .eq('status', 'active');

  const existingProductIds = new Set(existingSubs?.map(s => s.product_id) || []);
  
  const newItems = autoshipItems.filter(item => !existingProductIds.has(item.product_id));
  const duplicateItems = autoshipItems.filter(item => existingProductIds.has(item.product_id));

  if (duplicateItems.length > 0) {
    console.log('Skipping duplicate subscriptions for products:', 
      duplicateItems.map(i => i.product_id).join(', '));
  }

  if (!newItems.length) {
    return { data: null, error: null };
  }

  const subscriptions = newItems.map(item => {
    const nextPaymentDate = new Date(startDate);
    nextPaymentDate.setDate(startDate.getDate() + (item.autoship_interval || 30));

    return {
      user_id: order.user_id,
      order_id: order.id,
      order_item_id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price,
      autoship_interval: item.autoship_interval || 30,
      start_date: startDate,
      next_payment_date: nextPaymentDate,
      status: 'active'
    };
  });

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptions)
      .select();

    if (error) {
      if (error.message.includes('unique_active_subscription')) {
        console.warn('Duplicate subscription detected, skipping creation');
        return { data: null, error: null };
      }
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating subscriptions:', error);
    return { data: null, error };
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