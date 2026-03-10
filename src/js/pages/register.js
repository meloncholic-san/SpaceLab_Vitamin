import { resetFileDisplay, setupFileUpload } from "../components/setup-file-upload";
import { signUp, uploadTempDocument } from "../services/auth";
import { showToast } from "../components/show-toast";

export async function initRegisterPage() {
    setupFileUpload();

    const form = document.getElementById('register-form');
    if (!form) return;

    const btns = document.querySelectorAll('.register__btn');
    const permissionItem = document.querySelector('.register__item.permission');
    const submitBtn = document.querySelector('.register__submit');
    const fileInput = form.querySelector('.register__file-input');

    const fieldsConfig = {
        email: /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        first_name: /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s'-]{2,}$/,
        last_name: /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s'-]{2,}$/,
        password: /^.{6,}$/
    };

    function showError(field) {
        field.closest('.register__item')?.classList.add('input-error');
    }

    function clearError(field) {
        field.closest('.register__item')?.classList.remove('input-error');
    }

    function validateField(field) {
        const value = field.value.trim();
        const regex = fieldsConfig[field.name];

        if (!value || (regex && !regex.test(value))) {
            showError(field);
            return false;
        }

        clearError(field);
        return true;
    }

    function validateAllFields() {
        let valid = true;

        Object.keys(fieldsConfig).forEach(name => {
            const field = form.querySelector(`[name="${name}"]`);
            if (!validateField(field)) valid = false;
        });

        const isWholesale = document.querySelector('.btn-wholesale.active');
        if (isWholesale && (!fileInput.files || fileInput.files.length === 0)) {
            valid = false;
            showError(fileInput);
            showToast('Please upload wholesale purchase permission document', 'error');
        }

        return valid;
    }

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (permissionItem) {
                const isWholesale = btn.classList.contains('btn-wholesale');
                permissionItem.style.display = isWholesale ? 'block' : 'none';
            }
        });
    });

    
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            if (input.dataset.touched) validateField(input);
        });
        input.addEventListener('blur', () => {
            input.dataset.touched = 'true';
            validateField(input);
        });
    });

    if (fileInput) {
        fileInput.addEventListener('change', () => {
            fileInput.dataset.touched = 'true';
            clearError(fileInput);
        });
    }

    if (permissionItem) permissionItem.style.display = 'none';


    form.addEventListener('submit', async e => {
        e.preventDefault();

        if (!validateAllFields()) return;

        const isWholesale = document.querySelector('.btn-wholesale.active');
        const formData = new FormData(form);
        let tempDocumentUrl = null;

        if (isWholesale) {
            if (!fileInput.files || fileInput.files.length === 0) {
                return;
            }
            tempDocumentUrl = await uploadTempDocument(fileInput.files[0]);
        }
        submitBtn.disabled = true;
        const user = await signUp({
            email: formData.get('email'),
            password: formData.get('password'),
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            role: isWholesale ? 'wholesale' : 'regular',
            temp_document_path: tempDocumentUrl,
        });

        console.log(user);
        showToast('Check your email to confirm registration', 'success');
        submitBtn.disabled = false;
        form.reset();
        resetFileDisplay();

        
    });
}