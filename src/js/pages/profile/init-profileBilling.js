import { getCurrentUser } from "../../services/auth";
import { showToast } from "../../components/show-toast";
import { getBillingData, saveBillingData } from "../../services/profile";

export async function initProfileBilling() {
  const form = document.querySelector(".profile-billing__form");
  if (!form) return;

  const saveBtn = form.querySelector(".profile-billing__submit");

  const { data: { user } } = await getCurrentUser();
  if (!user) return;

  const billing = await getBillingData();
  if (billing) {
    form.cardNumber.value = billing.card_number || "";

    if (billing.expiry_month && billing.expiry_year) {
      const month = String(billing.expiry_month).padStart(2, '0');
      const year = String(billing.expiry_year).slice(-2);
      form.expiry.value = `${month}/${year}`;
    }

    form.cvc.value = billing.cvc || "";
  }

  const fieldsConfig = {
    cardNumber: /^\d{12,16}$/,
    expiry: /^(0[1-9]|1[0-2])\/\d{2}$/,
    cvc: /^\d{3,4}$/
  };

  function showError(field, type) {
    const group = field.closest(".profile-billing__field");
    const requiredError = group?.querySelector(".profile-billing__error--required");
    const patternError = group?.querySelector(".profile-billing__error--pattern");

    requiredError?.classList.remove("visible");
    patternError?.classList.remove("visible");

    if (type === "required") requiredError?.classList.add("visible");
    if (type === "pattern") patternError?.classList.add("visible");

    field.classList.add("invalid");
  }

  function clearError(field) {
    const group = field.closest(".profile-billing__field");
    group?.querySelectorAll(".visible").forEach(el => el.classList.remove("visible"));
    field.classList.remove("invalid");
  }

  function validateField(field) {
    const value = field.value.trim();
    
    let fieldKey = field.id;
    if (fieldKey === 'billing-cardNumber') fieldKey = 'cardNumber';
    if (fieldKey === 'billing-expiry') fieldKey = 'expiry';
    if (fieldKey === 'billing-cvc') fieldKey = 'cvc';
    
    const regex = fieldsConfig[fieldKey];

    if (!value) {
      showError(field, "required");
      return false;
    }

    if (regex && !regex.test(value)) {
      showError(field, "pattern");
      return false;
    }

    clearError(field);
    return true;
  }


  form.querySelector("#billing-cardNumber")?.addEventListener("input", (e) => {
    validateField(e.target);
  });

  form.querySelector("#billing-cvc")?.addEventListener("input", (e) => {
    validateField(e.target);
  });


  form.querySelector("#billing-expiry")?.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
    
    if (!value) {
      showError(e.target, "required");
    } else if (!fieldsConfig.expiry.test(value)) {
      showError(e.target, "pattern");
    } else {
      clearError(e.target);
    }
  });


  function getFormData() {
    return Object.fromEntries(new FormData(form).entries());
  }

  let initialData = getFormData();
  if (saveBtn) saveBtn.disabled = true;

  form.addEventListener("input", () => {
    const changed = JSON.stringify(getFormData()) !== JSON.stringify(initialData);
    if (saveBtn) {
      saveBtn.disabled = !changed;
      saveBtn.classList.toggle('disabled', !changed);
    }
  });


  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let valid = true;

    ["billing-cardNumber", "billing-expiry", "billing-cvc"].forEach(id => {
      const field = form.querySelector(`#${id}`);
      if (field && !validateField(field)) valid = false;
    });

    if (!valid) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    const data = getFormData();

    try {
      const result = await saveBillingData({
        cardNumber: data.cardNumber,
        expiry: data.expiry,
        cvc: data.cvc
      });

      if (result?.error) {
        throw new Error(result.error.message);
      }

      showToast("Payment method saved successfully", "success");

      initialData = getFormData();
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.classList.add('disabled');
      }

    } catch (err) {
      console.error('Save error:', err);
      showToast("Failed to save payment method", "error");
    }
  });
}