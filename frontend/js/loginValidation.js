function isValidLoginEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidLoginPassword(password) {
  return password.length >= 8;
}

if (typeof document !== 'undefined') {
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

        const headline = successBanner.querySelector('.login-success-title');
        const body = successBanner.querySelector('.login-success-body');

        if (headline) {
          headline.textContent = message;
        }

        if (body) {
          body.textContent = 'You can now continue to your saved reports and scans.';
        }

        successBanner.classList.remove('hidden');
        successBanner.classList.remove('banner-enter');
        void successBanner.offsetWidth;
        successBanner.classList.add('banner-enter');
        successBanner.removeAttribute('aria-hidden');
      };

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

        if (!emailValue) {
          showError(emailInput, 'Email is required.');
        } else if (!isValidLoginEmail(emailValue)) {
          showError(emailInput, 'Please enter a valid email address.');
        }
      }

      if (passwordInput) {
        clearError(passwordInput);
        const passwordValue = passwordInput.value;

        if (!passwordValue) {
          showError(passwordInput, 'Password is required.');
        } else if (!isValidLoginPassword(passwordValue)) {
          showError(passwordInput, 'Password must be at least 8 characters long.');
        }
      }

      if (!isValid) {
        const firstError = loginForm.querySelector('.field-error');
        const input = firstError?.parentElement.querySelector('input');
        input?.focus();
        return;
      }

      hideSuccessBanner();
      showSuccessBanner('Signed in successfully.');
      loginForm.reset();
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isValidLoginEmail,
    isValidLoginPassword,
  };
}
