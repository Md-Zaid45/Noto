import { useState } from "react";
import { feildsConfig, validateForm, validators } from "./authLogic";
import Input from "./input";
import { NavLink } from "react-router-dom";
import useFormHandlers from "./hooks";

export default function Login() {
  const [formValues, setFormValues] = useState({
    Email: "",
    Password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    Email: false,
    Password: false,
  });

  const { submitHandler, handleInput, handleBlur } = useFormHandlers(
    formValues,
    setFormValues,
    errors,
    setErrors,
    touched,
    setTouched,
  );

  return (
    <>
      <form
        noValidate
        onSubmit={submitHandler}
        className="grid gap-4 max-w-md mx-auto p-4"
      >
        {Object.keys(formValues).map((feild) => (
          <Input
            key={feild}
            name={feild}
            value={formValues[feild]}
            type={feildsConfig[feild].type}
            placeholder={feildsConfig[feild].placeholder}
            handleInput={handleInput}
            handleBlur={handleBlur}
            error={errors[feild]}
            touched={touched[feild]}
          />
        ))}{" "}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          Login
        </button>
      </form>
      <center>
        Don't have an Account ?{" "}
        <NavLink to={"/signup"} className="text-blue-400">
          Signup
        </NavLink>
      </center>
    </>
  );
}
