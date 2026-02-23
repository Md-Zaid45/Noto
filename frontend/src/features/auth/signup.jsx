import { useState } from "react";

const validators = {
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
    if (value.length > 5) {
      return null;
    }
    return "Password must be greater than 5 characters";
  },

  ConfirmPassword: (value, allValues) => {
    if (
      allValues.CreatePassword.length > 0 &&
      value.length > 0 &&
      value === allValues.CreatePassword
    ) {
      return null;
    }
    return "Passwords did not match";
  },
};

function validateForm(values) {
  const newErrors = {};
  Object.entries(values).forEach(([name, value]) => {
    const newError = validators[name](value, values);
    if (newError) newErrors[name] = newError;
  });
  return newErrors;
}

export function SignUp() {
  const [formValues, setFormValues] = useState({
    Name: "",
    Email: "",
    CreatePassword: "",
    ConfirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    Name: false,
    Email: false,
    CreatePassword: false,
    ConfirmPassword: false,
  });

  const submitHandler = (e) => {
    e.preventDefault();

    const allTouched = Object.keys(formValues).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const allErrors = validateForm(formValues);
    setErrors(allErrors);

    if (Object.keys(allErrors).length === 0) {
      console.log("Submitting:", formValues);
    } else {
      console.log("Validation failed:", allErrors);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    const updatedValues = { ...formValues, [name]: value };
    setFormValues(updatedValues);

    if (touched[name]) {
      const newError = validators[name](value, updatedValues);
      if (newError) {
        setErrors((prev) => ({ ...prev, [name]: newError }));
      } else {
        setErrors((prev) => {
          const { [name]: removed, ...newErrors } = prev;
          return newErrors;
        });
      }

      if (name === "CreatePassword" && touched.ConfirmPassword) {
        const confirmError = validators.ConfirmPassword(
          updatedValues.ConfirmPassword,
          updatedValues,
        );
        if (confirmError) {
          setErrors((prev) => ({ ...prev, ConfirmPassword: confirmError }));
        } else {
          setErrors((prev) => {
            const { ConfirmPassword, ...newErrors } = prev;
            return newErrors;
          });
        }
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const updatedValues = { ...formValues, [name]: value };
    const newError = validators[name](value, updatedValues);
    if (newError) {
      setErrors((prev) => ({ ...prev, [name]: newError }));
    }
  };

  return (
    <form
      noValidate
      onSubmit={submitHandler}
      className="grid gap-4 max-w-md mx-auto p-4"
    >
      <div>
        <input
          name="Name"
          value={formValues.Name}
          placeholder="Name"
          onChange={handleInput}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded ${
            touched.Name && errors.Name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {touched.Name && errors.Name && (
          <div className="text-xs text-red-600 mt-1">{errors.Name}</div>
        )}
      </div>

      <div>
        <input
          name="Email"
          value={formValues.Email}
          placeholder="E-mail"
          type="email"
          onChange={handleInput}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded ${
            touched.Email && errors.Email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {touched.Email && errors.Email && (
          <div className="text-xs text-red-600 mt-1">{errors.Email}</div>
        )}
      </div>

      <div>
        <input
          name="CreatePassword"
          value={formValues.CreatePassword}
          placeholder="Create Password"
          type="password"
          onChange={handleInput}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded ${
            touched.CreatePassword && errors.CreatePassword
              ? "border-red-500"
              : "border-gray-300"
          }`}
        />
        {touched.CreatePassword && errors.CreatePassword && (
          <div className="text-xs text-red-600 mt-1">
            {errors.CreatePassword}
          </div>
        )}
      </div>

      <div>
        <input
          name="ConfirmPassword"
          value={formValues.ConfirmPassword}
          placeholder="Confirm Password"
          type="password"
          onChange={handleInput}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded ${
            touched.ConfirmPassword && errors.ConfirmPassword
              ? "border-red-500"
              : "border-gray-300"
          }`}
        />
        {touched.ConfirmPassword && errors.ConfirmPassword && (
          <div className="text-xs text-red-600 mt-1">
            {errors.ConfirmPassword}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
      >
        Sign Up
      </button>
    </form>
  );
}
