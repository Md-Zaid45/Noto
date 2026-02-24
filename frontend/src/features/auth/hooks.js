import { validateForm, validators } from "./authLogic";

export default function useFormHandlers(
  formValues,
  setFormValues,
  errors,
  setErrors,
  touched,
  setTouched,
) {
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
  return { submitHandler, handleInput, handleBlur };
}
