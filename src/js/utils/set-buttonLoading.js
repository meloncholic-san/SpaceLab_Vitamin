export function setButtonLoading(isLoading, button) {
  if (!button) return;

  if (isLoading && !button.dataset.originalText) {
    button.dataset.originalText = button.textContent;
  }
  button.disabled = isLoading;
  button.textContent = isLoading ? 'Loading...' : `${button.dataset.originalText}`;
  if(button.disabled) button.classList.add('is-loading'); else button.classList.remove('is-loading');
}
