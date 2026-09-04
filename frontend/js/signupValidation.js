function isValidFullName(fullName) {
  const nameValue = fullName.trim();
  return Boolean(nameValue) && nameValue.length >= 2 && /^[a-zA-Z\s.'-]+$/.test(nameValue);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPassword(password) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

function isValidGoal(goal) {
  return Boolean(goal);
}

if (typeof document !== 'undefined') {
  const signupForm = document.querySelector('form');

  if (signupForm) {
    signupForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const fullNameInput = signupForm.querySelector('input[name="full_name"]');
    const emailInput = signupForm.querySelector('input[name="email"]');
    const passwordInput = signupForm.querySelector('input[name="password"]');
    const goalSelect = signupForm.querySelector('select[name="goal"]');
    const updatesCheckbox = signupForm.querySelector('input[name="updates"]');
    const successBanner = document.getElementById('signup-success-banner');

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

      const headline = successBanner.querySelector('.signup-success-title');
      const body = successBanner.querySelector('.signup-success-body');

      if (headline) {
        headline.textContent = message;
      }

      if (body) {
        body.textContent = 'Your signup details are ready to be sent to the backend when you connect it.';
      }

      successBanner.classList.remove('hidden');
      successBanner.classList.remove('banner-enter');
      void successBanner.offsetWidth;
      successBanner.classList.add('banner-enter');
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

      if (fullNameInput) {
      clearError(fullNameInput);
      const nameValue = fullNameInput.value.trim();

      if (!nameValue) {
        showError(fullNameInput, 'Full name is required.');
      } else if (nameValue.length < 2) {
        showError(fullNameInput, 'Name must be at least 2 characters long.');
      } else if (!/^[a-zA-Z\s.'-]+$/.test(nameValue)) {
        showError(fullNameInput, 'Use letters and spaces only.');
      }
    }

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
      } else if (passwordValue.length < 8) {
        showError(passwordInput, 'Password must be at least 8 characters long.');
      } else if (!/[A-Za-z]/.test(passwordValue) || !/\d/.test(passwordValue)) {
        showError(passwordInput, 'Password must include letters and numbers.');
      }
    }

      if (goalSelect) {
      clearError(goalSelect);
      const goalValue = goalSelect.value;

      if (!isValidGoal(goalValue)) {
        showError(goalSelect, 'Please select a primary goal.');
      }
    }

    if (updatesCheckbox) {
      updatesCheckbox.setCustomValidity('');
    }

    const focusFirstError = () => {
      const firstError = signupForm.querySelector('.field-error');
      if (firstError) {
        const input = firstError.parentElement.querySelector('input, select, textarea');
        input?.focus();
        input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    const showToast = (message, type = 'info', timeout = 3500) => {
      let container = document.getElementById('tl-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'tl-toast-container';
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

      showSuccessBanner('Account created successfully.');
      showToast('Account created successfully!', 'success', 3000);
      signupForm.reset();
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isValidFullName,
    isValidEmail,
    isValidPassword,
    isValidGoal,
  };
}
