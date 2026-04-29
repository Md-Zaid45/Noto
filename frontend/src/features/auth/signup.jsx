import { useState } from "react";
import Input from "./input";
import { feildsConfig } from "./authLogic";
import { NavLink } from "react-router-dom";
import useFormHandlers from "./hooks";

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
  const { signupHandler, handleInput, handleBlur } = useFormHandlers(
    formValues,
    setFormValues,
    errors,
    setErrors,
    touched,
    setTouched
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Create an account
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Start building your knowledge base
        </p>

        <form noValidate onSubmit={signupHandler} className="space-y-5">
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
          ))}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors"
          >
            Log in
          </NavLink>
        </p>
      </div>
    </div>
  );
}