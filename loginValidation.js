const loginForm = document.querySelector('form');

if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const emailInput = loginForm.querySelector('input[name="email"]');
    const passwordInput = loginForm.querySelector('input[name="password"]');
    const successBanner = document.getElementById('login-success-banner');

    let isValid = true;

    const hideSuccessBanner = () => {
      if (!successBanner) {
        return;
      }

      successBanner.classList.add('hidden');
      successBanner.setAttribute('aria-hidden', 'true');
    };

    const showSuccessBanner = (message) => {
      if (!successBanner) {
        return;
      }

      const title = successBanner.querySelector('.login-success-title');
      const body = successBanner.querySelector('.login-success-body');

      if (title) {
        title.textContent = message;
      }

      if (body) {
        body.textContent = 'You can now continue to your saved reports and scans.';
      }

      successBanner.classList.remove('hidden');
      successBanner.removeAttribute('aria-hidden');
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    hideSuccessBanner();

    const clearError = (input) => {
      input.classList.remove('border-red-500', 'ring-red-500/20');
      input.classList.add('border-neutral-700');
      input.removeAttribute('aria-invalid');

      const errorText = input.parentElement?.querySelector('.field-error');
      if (errorText) {
        errorText.remove();
      }
    };

    const showError = (input, message) => {
      isValid = false;
      input.classList.remove('border-neutral-700');
      input.classList.add('border-red-500', 'ring-2', 'ring-red-500/20');
      input.setAttribute('aria-invalid', 'true');

      let errorContainer = input.parentElement?.querySelector('.field-error');
      if (!errorContainer) {
        errorContainer = document.createElement('p');
        errorContainer.className = 'field-error mt-2 text-xs text-red-400';
        errorContainer.setAttribute('role', 'alert');
        errorContainer.setAttribute('aria-live', 'assertive');
        input.parentElement.appendChild(errorContainer);
      }

      errorContainer.textContent = message;
    };

    if (emailInput) {
      clearError(emailInput);
      const emailValue = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValue) {
        showError(emailInput, 'Email is required.');
      } else if (!emailPattern.test(emailValue)) {
        showError(emailInput, 'Please enter a valid email address.');
      }
    }

    if (passwordInput) {
      clearError(passwordInput);
      const passwordValue = passwordInput.value;

      if (!passwordValue) {
        showError(passwordInput, 'Password is required.');
      }
    }

    const focusFirstError = () => {
      const firstError = loginForm.querySelector('.field-error');
      if (firstError) {
        const input = firstError.parentElement?.querySelector('input, select, textarea');
        input?.focus();
        input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    const showToast = (message, type = 'info', timeout = 3000) => {
      let container = document.getElementById('tl-login-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'tl-login-toast-container';
        container.className = 'fixed top-6 right-6 z-50 flex flex-col gap-3';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
      toast.className = `max-w-sm rounded-lg px-4 py-3 shadow-lg text-sm font-medium text-white ${
        type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-neutral-800'
      }`;
      toast.textContent = message;

      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => toast.remove(), 320);
      }, timeout);
    };

    if (!isValid) {
      focusFirstError();
      showToast('Please fix the highlighted fields and try again.', 'error', 4000);
      return;
    }

    showSuccessBanner('Signed in successfully.');
    showToast('Signed in successfully!', 'success', 3000);
    loginForm.reset();
  });
}
