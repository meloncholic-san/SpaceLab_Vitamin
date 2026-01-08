import { supabase } from '../api/supabase';

const PAGE_SIZE = 6;

export async function getProducts({category = 'all', page = 1,}) {
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (category !== 'all') {
    if (category === 'sale') {
      query = query.gt('discount', 0);
    } else {
      query = query.eq('category', category);
    }
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await query.range(from, to);

  if (error) throw error;
  return data;
}



export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}


export async function getAdvertisementProducts({category,excludeId,limit = 4}) {

  const { data: sameCategory, error: catError } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(limit - 1);

  if (catError) throw catError;

  const { data: saleProduct, error: saleError } = await supabase
    .from('products')
    .select('*')
    .gt('discount', 0)
    .neq('id', excludeId)
    .limit(1);

  if (saleError) throw saleError;

  const result = [
    ...sameCategory,
    ...(saleProduct ?? []).filter(
      sale =>
        !sameCategory.some(p => p.id === sale.id)
    )
  ];

  return result.slice(0, limit);
}
