import { signIn, getCurrentSession } from "../services/auth";

export async function initLoginPage() {
    const form = document.getElementById('login-form');
    
    // const { data } = await getCurrentSession();
    // const user = data?.session?.user;

    // if (user) {
    // window.location.href = '/';
    // }
    
    function checkForm() {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim() || !input.checkValidity()) {
                isValid = false;
                if (input.dataset.touched) {
                    input.closest('.login__item')?.classList.add('input-error');
                }
            } else {
                input.closest('.login__item')?.classList.remove('input-error');
            }
        });
        
    }

    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', () => {
            input.dataset.touched = 'true';
            checkForm();
        });
        
        input.addEventListener('input', checkForm);
    });
    
    checkForm();
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        try {
            await signIn({
            email: formData.get('email'),
            password: formData.get('password'),
            });
        } catch (err) {
            alert(err.message);
        }
        form.reset();
        console.log('Login submitted');
    });
}