export const validators = {
  Name: (value, allValues) => {
    if (value.length > 0) {
      return null;
    }
    return "Name is required";
  },

  Email: (value, allValues) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return null;
    }
    return "Invalid Email id";
  },

  CreatePassword: (value, allValues) => {
    if (/^(?=.*[A-Za-z])(?=.*\d).{6,20}$/.test(value)) {
      return null;
    }
    return "Password must be 6–20 characters, including at least one letter and one number";
  },

  ConfirmPassword: (value, allValues) => {
    if (
      /^(?=.*[A-Za-z])(?=.*\d).{6,20}$/.test(value) &&
      value === allValues.CreatePassword
    ) {
      return null;
    }
    return "Passwords did not match";
  },
  Password: (value, allValues) => {
    if (/^(?=.*[A-Za-z])(?=.*\d).{6,20}$/.test(value)) {
      return null;
    }
    return "Invalid Password";
  },
};

export const feildsConfig = {
  Name: {
    type: "text",
    placeholder: "Name",
  },

  Email: {
    type: "e-mail",
    placeholder: "E-Mail",
  },

  CreatePassword: {
    type: "password",
    placeholder: "Create a Password",
  },

  ConfirmPassword: {
    type: "password",
    placeholder: "Confirm your Password",
  },
  Password: {
    type: "password",
    placeholder: "Enter Password",
  },
};

export function validateForm(values) {
  const newErrors = {};
  Object.entries(values).forEach(([name, value]) => {
    const newError = validators[name](value, values);
    if (newError) newErrors[name] = newError;
  });
  return newErrors;
}
