import { supabase } from "../../api/supabase";
import { showToast } from "../../components/show-toast";

    function showError(field, type) {
        const group = field.closest(".profile-password__field");
        group?.querySelectorAll(".visible").forEach(el => el.classList.remove("visible"));
        
        let errorType = type;
        if (type === "invalid-current") {
            errorType = "pattern";
        }
        
        const errorEl = group?.querySelector(`.profile-password__error--${errorType}`);
        errorEl?.classList.add("visible");
        field.classList.add("invalid");
    }

    function clearError(field) {
        const group = field.closest(".profile-password__field");
        group?.querySelectorAll(".visible").forEach(el => el.classList.remove("visible"));
        field.classList.remove("invalid");
    }


export async function initProfilePassword() {
    const form = document.querySelector("#password-form");
    if (!form) return;

    const submitBtn = form.querySelector(".profile-password__submit");
    const currentPass = form.querySelector("#current-password");
    const newPass = form.querySelector("#new-password");
    const confirmPass = form.querySelector("#confirm-password");


    function validateForm() {
        let isValid = true;

        if (!currentPass.value.trim()) {
            showError(currentPass, "required");
            isValid = false;
        } else {
            clearError(currentPass);
        }

        if (!newPass.value.trim()) {
            showError(newPass, "required");
            isValid = false;
        } else {
            clearError(newPass);
        }

        if (!confirmPass.value.trim()) {
            showError(confirmPass, "required");
            isValid = false;
        } else if (newPass.value !== confirmPass.value) {
            showError(confirmPass, "match");
            isValid = false;
        } else {
            clearError(confirmPass);
        }
        submitBtn.disabled = !isValid;
        return isValid;
    }

    [currentPass, newPass, confirmPass].forEach(input => {
        input.addEventListener("input", validateForm);
    });

    validateForm();


    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        submitBtn.disabled = true;
        submitBtn.textContent = "Checking...";

        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user || !user.email) {
                throw new Error("User not found");
            }

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPass.value
            });

            if (signInError) {
                showError(currentPass, "invalid-current");
                submitBtn.disabled = false;
                submitBtn.textContent = "Update Password";
                showToast("Current password is incorrect", "error");
                return;
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: newPass.value
            });

            if (updateError) throw updateError;

            showToast("Password updated successfully", "success");
            form.reset();
            validateForm();

        } catch (error) {
            console.error("Error:", error);
            showToast(`Failed to update password ${error}`, "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Save";
        }
    });
}