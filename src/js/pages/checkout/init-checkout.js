import { supabase } from "../../api/supabase"
import { showToast } from "../../components/show-toast";
import { getOrderWithItems, updateOrderStatus } from "../../services/checkout"
import { saveBillingData, saveShippingData, getShippingData, getBillingData } from "../../services/profile";
import { createSubscriptionsFromOrder } from "../../services/subscriptions";
import { renderCheckoutProducts } from "./render-checkout-products"
import { State } from 'country-state-city';



function updateTotals(items) {
    const subtotalEl = document.querySelector('.checkout__order-price');
    const discountEl = document.querySelector('.checkout__order-discount');
    const shippingEl = document.querySelector('.checkout__order-shipping');
    const totalEl = document.querySelector('.checkout__order-total');
    const totalOpenerEl = document.querySelector('.checkout__order-opener-total');
    const discountWrapper = document.querySelector('.checkout__order-pricing.discount')
    let subtotal = 0;
    let discountTotal = 0;

    items.forEach(item => {
        const original = item.oldPrice || item.price;
        const final = parseFloat(item.price);

        subtotal += original * item.quantity;

        if (item.oldPrice) {
            discountTotal += (original - final) * item.quantity;
        }
    });

    const shipping = subtotal * 0.05;
    const total = subtotal - discountTotal + shipping;
    if (!discountTotal) {
      discountWrapper.style="display:none";
    }
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    discountEl.textContent = `-$${discountTotal.toFixed(2)}`;
    shippingEl.textContent = `$${shipping.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
    totalOpenerEl.textContent = `$${total.toFixed(2)}`;
}

function formStateFilling () {
  const states = State.getStatesOfCountry('US');
  // const states = State.getAllStates();
  const stateSelect = document.getElementById('state');
  
  if (!stateSelect) return;
  
  states.forEach(state => {
      const option = document.createElement('option');
      option.value = state.isoCode;
      // option.textContent = state.name;
      option.textContent = state.isoCode;
      stateSelect.appendChild(option);
  });
  
  if (!stateSelect.value) {
    stateSelect.selectedIndex = 0;
  }
  
}

function toggleMobileOrder () {
  const orderOpenerRef = document.querySelector('.checkout__order-opener');
  const orderArrowRef = document.querySelector('.checkout__order-opener-arrow');
  const orderRef = document.querySelector('.checkout__order');
  orderOpenerRef.addEventListener('click', e => {
    e.preventDefault();
    orderArrowRef.classList.toggle('active');
    orderRef.classList.toggle('active');
    orderOpenerRef.classList.toggle('active');
  })
}

export async function initCheckout() {
  toggleMobileOrder();
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('order');
  if (!orderId) return;

  const form = document.getElementById('checkout-form');
  const submitBtn = form.querySelector('.checkout__submit');
  const container = document.querySelector('.checkout__order-list');
  formStateFilling();
  
  const order = await getOrderWithItems(orderId);
  if (!order) return;

  if (order.status === "success") {
      window.location.href = `/checkout-success?order=${orderId}`;
  }

  const processedItems = renderCheckoutProducts(order.order_items, container);
  updateTotals(processedItems);


  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = '/login';
    return;
  }

  const existingShipping = await getShippingData();
  if (existingShipping) {
      form.firstName.value = existingShipping.first_name || '';
      form.lastName.value = existingShipping.last_name || '';
      form.address1.value = existingShipping.address1 || '';
      form.address2.value = existingShipping.address2 || '';
      form.city.value = existingShipping.city || '';
      form.state.value = existingShipping.state || '';
      form.zip.value = existingShipping.zip || '';
      form.phone.value = existingShipping.phone || '';
      form.email.value = existingShipping.email || '';
  }


  const existingBilling = await getBillingData();
  if (existingBilling) {
      form.cardNumber.value = existingBilling.card_number || '';

      if (existingBilling.expiry_month && existingBilling.expiry_year) {
          const month = String(existingBilling.expiry_month).padStart(2, '0');
          const year = String(existingBilling.expiry_year).slice(-2);
          form.expiry.value = `${month}/${year}`;
      }

      form.cvc.value = existingBilling.cvc || '';
  }





  const fieldsConfig = {
    firstName: /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s'-]{2,}$/,
    lastName: /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s'-]{2,}$/,
    address1: /^.{5,}$/,
    city: /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s'-]{2,}$/,
    zip: /^\d{0,10}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?\d{10,15}$/,
    cardNumber: /^\d{12,20}$/,
    expiry: /^(0[1-9]|1[0-2])\/\d{2}$/,
    cvc: /^\d{3,4}$/
  };

  function showError(field, type) {
    const group = field.closest('[class*="checkout-form__field"]');
    const requiredError = group.querySelector('.form__error_required');
    const patternError = group.querySelector('.form__error_pattern');

    if (field.id === 'state') {
      const errorEl = document.querySelector('.checkout-form__field.state .form__error_required');
      if (errorEl) {
        errorEl.classList.add('visible');
        field.classList.add('invalid');
      }
      return;
    }

    requiredError?.classList.remove('visible');
    patternError?.classList.remove('visible');

    if (type === 'required') requiredError?.classList.add('visible');
    if (type === 'pattern') patternError?.classList.add('visible');

    field.classList.add('invalid');
  }

  function clearError(field) {
    const group = field.closest('[class*="checkout-form__field"]');
    if (field.id === 'state') {
      const errorEl = document.querySelector('.checkout-form__field.state .form__error_required');
        errorEl?.classList.remove('visible');
        field.classList.remove('invalid');
      return;
    }
    group.querySelectorAll('.visible').forEach(el => el.classList.remove('visible'));
    field.classList.remove('invalid');
  }

  function validateField(field) {
    const value = field.value.trim();
    const regex = fieldsConfig[field.id];

    if (!value) {
      showError(field, 'required');
      return false;
    }

    if (regex && !regex.test(value)) {
      showError(field, 'pattern');
      return false;
    }

    clearError(field);
    return true;
  }


  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      if (fieldsConfig[input.id] && input.id !== 'expiry') {
        validateField(input);
      }
    });
  });

  form.querySelector('#state').addEventListener('change', (e) => {
    if (!e.target.value) {
      showError(e.target, 'required');
    } else {
      clearError(e.target);
    }
  });

  form.querySelector('#expiry').addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');
  
  if (value.length > 4) value = value.slice(0, 4);
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2);
  }
  
  e.target.value = value;
  
  if (fieldsConfig.expiry) {
    const field = e.target;
    const regex = fieldsConfig.expiry;
    
    if (!field.value.trim()) {
      showError(field, 'required');
    } else if (!regex.test(field.value)) {
      showError(field, 'pattern');
    } else {
        clearError(field);
    }
  }
});


form.addEventListener('submit', async (e) => {

  e.preventDefault();
  e.stopPropagation();
  let valid = true;


  const formData = new FormData(form);
  console.log('FormData Contents:');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  Object.keys(fieldsConfig).forEach(id => {
    const field = form.querySelector(`#${id}`);
    if (field && !validateField(field)) valid = false;
  });
  console.log(valid)
  const stateSelect = form.querySelector('#state');
  if (!stateSelect.value) {
    showError(stateSelect, 'required');
    valid = false;
  }
  console.log(valid)
  if (!valid) {
    const firstInvalid = form.querySelector('.invalid');
    firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  console.log(valid)

  const allFormData = Object.fromEntries(formData.entries());
  
  console.log('All form data:', allFormData);

  const shippingData = {
    firstName: allFormData.firstName,
    lastName: allFormData.lastName,
    address1: allFormData.address1,
    address2: allFormData.address2 || '',
    city: allFormData.city,
    state: allFormData.state,
    zip: allFormData.zip,
    email: allFormData.email,
    phone: allFormData.phone
  };

  const billingData = {
    cardNumber: allFormData.cardNumber,
    expiry: allFormData.expiry,
    cvc: allFormData.cvc
  };

  console.log('Shipping data:', shippingData);
  console.log('Billing data:', billingData);

try {
    const shippingResult = await saveShippingData(shippingData);
    if (shippingResult?.error) {
        throw new Error(`Shipping error: ${shippingResult.error.message}`);
    }

    const billingResult = await saveBillingData(billingData);
    if (billingResult?.error) {
        throw new Error(`Billing error: ${billingResult.error.message}`);
    }

    const statusResult = await updateOrderStatus(orderId, 'success');
    if (statusResult?.error) {
        throw new Error(`Status update error: ${statusResult.error.message}`);
    }
    const subscriptionResult = await createSubscriptionsFromOrder(order);
    if (subscriptionResult?.error) {
        throw new Error(`Status update error: ${subscriptionResult.error.message}`);
    }
    showToast('Order placed successfully!', 'success', 2000);
    
    setTimeout(() => {
        window.location.href = `/checkout-success?order=${orderId}`;
    }, 1500);

} catch (error) {
    console.error('Error saving data:', error.message);
    showToast(`Failed to process order. ${error.message}`, 'error');
    return;
}


});

}
