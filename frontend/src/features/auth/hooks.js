import { useDispatch } from "react-redux";
import { validateForm, validators } from "./authLogic";
import { setLoggedIn } from "../../store/authSlice";
import {jwtDecode} from 'jwt-decode'
const API_URL = import.meta.env.VITE_API_URL

export default function useFormHandlers(
  formValues,
  setFormValues,
  errors,
  setErrors,
  touched,
  setTouched,
) {
  const dispatch = useDispatch();
  const signupHandler = async (e) => {
    e.preventDefault();

    const allTouched = Object.keys(formValues).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const allErrors = validateForm(formValues);
    setErrors(allErrors);

    const data = {
      email: formValues.Email,
      password: formValues.ConfirmPassword,
      name: formValues.Name,
    };

    if (Object.keys(allErrors).length === 0) {
      console.log("Submitting:", formValues, data);
      const result = await fetch(`${API_URL}/api/v1/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const r = await result.json();
    } else {
      console.log("Validation failed:", allErrors);
    }
  };
  const loginHandler = async (e) => {
    e.preventDefault();

    const allTouched = Object.keys(formValues).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const allErrors = validateForm(formValues);
    setErrors(allErrors);

    const data = {
      email: formValues.Email,
      password: formValues.Password,
    };

    if (Object.keys(allErrors).length === 0) {
      console.log("Submitting:", formValues, data);
      const result = await fetch(`${API_URL}/api/v1/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const res = await result.json();
      console.log(res);
            console.log(res, res.success);
      if (res.success === true) {
        const decoded = jwtDecode(res.token);
        console.log(decoded);
        dispatch(setLoggedIn(decoded.name));
      }

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
  return { loginHandler, signupHandler, handleInput, handleBlur };
}
