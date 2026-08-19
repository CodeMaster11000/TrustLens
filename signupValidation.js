const signupForm = document.querySelector('form');

if (signupForm) {
  signupForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const fullNameInput = signupForm.querySelector('input[name="full_name"]');
    const emailInput = signupForm.querySelector('input[name="email"]');
    const passwordInput = signupForm.querySelector('input[name="password"]');
    const goalSelect = signupForm.querySelector('select[name="goal"]');
    const updatesCheckbox = signupForm.querySelector('input[name="updates"]');

    let isValid = true;

    const clearError = (input) => {
      input.classList.remove('border-red-500', 'ring-red-500/20');
      input.classList.add('border-neutral-700');

      const errorText = input.parentElement?.querySelector('.field-error');
      if (errorText) {
        errorText.remove();
      }
    };

    const showError = (input, message) => {
      isValid = false;
      input.classList.remove('border-neutral-700');
      input.classList.add('border-red-500', 'ring-2', 'ring-red-500/20');

      let errorContainer = input.parentElement?.querySelector('.field-error');
      if (!errorContainer) {
        errorContainer = document.createElement('p');
        errorContainer.className = 'field-error mt-2 text-xs text-red-400';
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
      goalSelect.classList.remove('border-red-500', 'ring-red-500/20');
      goalSelect.classList.add('border-neutral-700');
      const goalValue = goalSelect.value;

      if (!goalValue) {
        goalSelect.classList.add('border-red-500', 'ring-2', 'ring-red-500/20');
        isValid = false;
      }
    }

    if (updatesCheckbox) {
      updatesCheckbox.setCustomValidity('');
    }

    if (isValid) {
      alert('Account created successfully!');
      signupForm.reset();
    }
  });
}
