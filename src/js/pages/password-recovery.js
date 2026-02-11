import { getCurrentSession, requestPasswordReset } from "../services/auth";

export async function initPasswordRecovery () {
    // const { data } = await getCurrentSession();
    // const user = data?.session?.user;

    // if (user) {
    // window.location.href = '/';
    // }

    const passwordResetForm = document.querySelector('#password-recovery_form');

    passwordResetForm.addEventListener('submit', async e => {
        e.preventDefault();

        const email = new FormData(passwordResetForm).get('email');

        try {
        await requestPasswordReset(email);

        alert('If this email exists, we have sent a recovery link.');
        passwordResetForm.reset();
        } catch (err) {
        alert('Something went wrong. Try again later.');
        console.log(err)
        }
            
    })
}