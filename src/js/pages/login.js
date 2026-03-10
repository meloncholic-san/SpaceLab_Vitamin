import { signIn } from "../services/auth";


export async function initLoginPage() {

  const form = document.getElementById('login-form');
  if (!form) return;

  const fieldsConfig = {
    email: /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    password: /^.{4,}$/
  };

  function showError(field) {
    field.closest('.login__item')?.classList.add('input-error');
  }

  function clearError(field) {
    field.closest('.login__item')?.classList.remove('input-error');
  }

  function validateField(field) {

    const value = field.value.trim();
    const regex = fieldsConfig[field.name];

    if (!value) {
      showError(field);
      return false;
    }

    if (regex && !regex.test(value)) {
      showError(field);
      return false;
    }

    clearError(field);
    return true;
  }

  function validateForm() {

    let valid = true;

    Object.keys(fieldsConfig).forEach(name => {
      const field = form.querySelector(`[name="${name}"]`);
      if (!validateField(field)) valid = false;
    });

    return valid;
  }

  form.querySelectorAll('input').forEach(input => {

    input.addEventListener('blur', () => {
      input.dataset.touched = 'true';
      validateField(input);
    });

    input.addEventListener('input', () => {
      if (input.dataset.touched) validateField(input);
    });

  });

  form.addEventListener('submit', async e => {

    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData(form);

    try {

      await signIn({
        email: formData.get('email'),
        password: formData.get('password'),
      });

      form.reset();
      window.location.href = './';

    } catch (err) {
      alert(err.message);
    }

  });

}