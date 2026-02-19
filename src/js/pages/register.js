import { resetFileDisplay, setupFileUpload } from "../components/setup-file-upload";
import { signUp, getCurrentSession, signOut, uploadTempDocument } from "../services/auth";
import { supabase } from "../api/supabase";

export async function initRegisterPage() {
    setupFileUpload();
    const form = document.getElementById('register-form');
    const btns = document.querySelectorAll('.register__btn');
    const permissionItem = document.querySelector('.register__item.permission');
    const submitBtn = document.querySelector('.register__submit');

    // const { data } = await getCurrentSession();
    // const user = data?.session?.user;

    // if (user) {
    // window.location.href = '/';
    // }

    // const logOutbtn = document.querySelector('.logout-btn');
    // logOutbtn.addEventListener('click', e => {
    //     signOut();
    // })

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('disabled');
    }
    
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (permissionItem) {
                permissionItem.style.display = btn.classList.contains('btn-wholesale') ? 'block' : 'none';
            }
        });
    });
    

    function validateInput(input) {
        const parent = input.closest('.register__item');
        if (!parent) return;
        
        parent.classList.remove('input-error');
        
        if (input.dataset.touched && !input.checkValidity()) {
            parent.classList.add('input-error');
        }
    }
    

    function validateForm() {
        if (!submitBtn) return;
        
        const inputs = form.querySelectorAll('input[required]');
        const isWholesale = document.querySelector('.btn-wholesale.active');
        const fileInput = form.querySelector('.register__file-input');
        
        let isValid = true;
        

        inputs.forEach(input => {
            if (!input.value.trim() || !input.checkValidity()) {
                isValid = false;
            }
        });
        
        if (isWholesale && (!fileInput.files || fileInput.files.length === 0)) {
            isValid = false;
            if (fileInput.dataset.touched) {
                fileInput.closest('.register__item')?.classList.add('input-error');
            }
        }
        
        submitBtn.disabled = !isValid;
        submitBtn.classList.toggle('disabled', !isValid);
    }
    

    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', () => {
            input.dataset.touched = 'true';
            validateInput(input);
            validateForm();
        });
        
        input.addEventListener('input', () => {
            validateInput(input);
            validateForm();
        });
    });
    

    if (permissionItem) {
        permissionItem.style.display = 'none';
    }
    
    validateForm();

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const isWholesale = document.querySelector('.btn-wholesale.active')
  const fileInput = form.querySelector('.register__file-input')
  const formData = new FormData(form);
  let tempDocumentUrl = null;

  if (isWholesale) {
    if (!fileInput.files || fileInput.files.length === 0) { alert('Please upload wholesale purchase permission document'); return; }
        tempDocumentUrl = await uploadTempDocument(
      fileInput.files[0]
    )
  } 

  const user = await signUp({
    email: formData.get('email'),
    password: formData.get('password'),
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    role: isWholesale ? 'wholesale' : 'regular',
    temp_document_path: tempDocumentUrl,
  })
  console.log(user)
  alert('Check your email to confirm registration')
})

}