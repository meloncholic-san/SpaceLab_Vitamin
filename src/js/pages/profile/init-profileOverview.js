import { getShippingData, saveShippingData } from "../../services/profile";
import { getCurrentUser } from "../../services/auth";
import { showToast } from "../../components/show-toast";
import { State } from "country-state-city";
import { getWholesaleDocumentUrl, uploadWholesaleDocument } from "../../utils/profile-file-upload";
import { supabase } from "../../api/supabase";

export async function initProfileOverview() {

  const form = document.querySelector(".checkout-form");
  if (!form) return;

  const saveBtn = form.querySelector(".profile-overview__submit-btn");
  const stateSelect = form.querySelector("#state");

  const fileInput = form.querySelector(".profile-overview__document-input");
  const fileBtn = form.querySelector(".profile-overview__document-btn");
  const fileNameEl = form.querySelector(".profile-overview__document-document-filename");
  const fileField = fileInput?.closest(".checkout-form__field");
  
  let fileLink = document.querySelector(".profile-overview__document-link");
  if (!fileLink && fileField) {
    fileLink = document.createElement('a');
    fileLink.className = 'profile-overview__document-link';
    fileLink.target = '_blank';
    fileLink.rel = 'noopener noreferrer';
    fileLink.style.display = 'none';
    fileField.appendChild(fileLink);
  }


  if (stateSelect) {
    State.getStatesOfCountry("US").forEach(state => {
      const option = document.createElement("option");
      option.value = state.isoCode;
      option.textContent = state.isoCode;
      stateSelect.appendChild(option);
    });
  }


  const shipping = await getShippingData();

  if (shipping) {
    form.firstName.value = shipping.first_name || "";
    form.lastName.value = shipping.last_name || "";
    form.address1.value = shipping.address1 || "";
    form.address2.value = shipping.address2 || "";
    form.city.value = shipping.city || "";
    form.state.value = shipping.state || "";
    form.zip.value = shipping.zip || "";
    form.email.value = shipping.email || "";
    form.phone.value = shipping.phone || "";
  }



  const { data: { user } } = await getCurrentUser();
  const role = user?.user_metadata?.role;

  const roleEl = document.querySelector(".profile__section-customer");

  if (role === "wholesale") {
    roleEl.textContent = "Wholesale Customer";
    if (fileField) fileField.style.display = "block";
    
    const { fileUrl, fileName } = await getWholesaleDocumentUrl(user.id);
    console.log(fileUrl, fileName)
    if (fileUrl && fileName) {
      fileNameEl.textContent = fileName;
      fileNameEl.classList.add('show');
      fileField.classList.add('has-file');

      if (fileLink) {
        fileLink.href = fileUrl;
        fileLink.style.display = 'inline';
        fileLink.textContent = 'View Document';
      }
    }
  } else {
    roleEl.textContent = "Regular Customer";
    if (fileField) fileField.style.display = "none";
  }


  if (role === "wholesale" && fileBtn && fileInput) {

    fileBtn.addEventListener("click", (e) => {
      e.preventDefault();
      fileInput.click();
    });

    fileInput.addEventListener("change", async () => {

      const file = fileInput.files[0];
      if (!file) return;

      const allowedTypes = [
        "image/jpeg",
        "image/png", 
        "application/pdf"
      ];

      if (!allowedTypes.includes(file.type)) {
        showToast("Only PDF, JPG or PNG allowed", "error");
        fileInput.value = "";
        return;
      }

      fileNameEl.textContent = file.name;
      fileNameEl.classList.add('show');
      fileField.classList.add('has-file');
      
      if (fileLink) {
        fileLink.style.display = 'none';
      }

      fileBtn.disabled = true;
      const originalBtnText = fileBtn.textContent;
      fileBtn.textContent = 'Uploading...';

      try {
        await uploadWholesaleDocument(file);

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('No active session');
        }

        const response = await fetch(
          'https://qdqbtiofhnjnfvortswl.supabase.co/functions/v1/init-wholesale-user',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Edge function error:', errorText);
          throw new Error('Failed to process document');
        }

        await response.json();

        const { fileUrl, fileName } = await getWholesaleDocumentUrl(user.id);
        
        if (fileUrl && fileName) {
          fileNameEl.textContent = fileName;
          
          if (fileLink) {
            fileLink.href = fileUrl;
            fileLink.style.display = 'inline';
            fileLink.textContent = 'View Document';
          }
        }

        showToast("Document uploaded successfully", "success");

      } catch (error) {
        console.error('Upload failed:', error);
        showToast("Upload failed: " + error.message, "error");
        
        const { fileUrl, fileName } = await getWholesaleDocumentUrl(user.id);
        
        if (fileUrl && fileName) {
          fileNameEl.textContent = fileName;
          if (fileLink) {
            fileLink.href = fileUrl;
            fileLink.style.display = 'inline';
          }
        } else {
          fileNameEl.classList.remove('show');
          fileField.classList.remove('has-file');
          if (fileLink) {
            fileLink.style.display = 'none';
          }
        }
        
        fileInput.value = "";
        
      } finally {
        fileBtn.disabled = false;
        fileBtn.textContent = originalBtnText;
      }
    });
  }


  const fieldsConfig = {
    firstName: /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s'-]{2,}$/,
    lastName: /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s'-]{2,}$/,
    address1: /^.{5,}$/,
    city: /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s'-]{2,}$/,
    zip: /^\d{1,10}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?\d{10,15}$/
  };

  function showError(field, type) {
    const group = field.closest(".checkout-form__field");
    const requiredError = group?.querySelector(".form__error_required");
    const patternError = group?.querySelector(".form__error_pattern");

    requiredError?.classList.remove("visible");
    patternError?.classList.remove("visible");

    if (type === "required") requiredError?.classList.add("visible");
    if (type === "pattern") patternError?.classList.add("visible");

    field.classList.add("invalid");
  }

  function clearError(field) {
    const group = field.closest(".checkout-form__field");
    group?.querySelectorAll(".visible").forEach(el => el.classList.remove("visible"));
    field.classList.remove("invalid");
  }

  function validateField(field) {
    const value = field.value.trim();
    const regex = fieldsConfig[field.id];

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

  form.querySelectorAll("input").forEach(input => {
    if (fieldsConfig[input.id]) {
      input.addEventListener("input", () => validateField(input));
    }
  });

  stateSelect?.addEventListener("change", e => {
    if (!e.target.value) showError(e.target, "required");
    else clearError(e.target);
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
      if (!changed) {
        saveBtn.classList.add('disabled');
      } else {
        saveBtn.classList.remove('disabled');
      }
    } 
  });


  form.addEventListener("submit", async e => {
    e.preventDefault();

    let valid = true;

    Object.keys(fieldsConfig).forEach(id => {
      const field = form.querySelector(`#${id}`);
      if (field && !validateField(field)) valid = false;
    });

    if (stateSelect && !stateSelect.value) {
      showError(stateSelect, "required");
      valid = false;
    }

    if (!valid) return;

    const data = getFormData();

    try {
      await saveShippingData({
        firstName: data.firstName,
        lastName: data.lastName,
        address1: data.address1,
        address2: data.address2 || "",
        city: data.city,
        state: data.state,
        zip: data.zip,
        email: data.email,
        phone: data.phone
      });

      showToast("Changes successfully saved", "success");

      initialData = getFormData();
      if (saveBtn) saveBtn.disabled = true;

    } catch (err) {
      console.error('Save error:', err);
      showToast("Failed to update profile", "error");
    }
  });
}