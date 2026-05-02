import { useEffect, useRef, useState } from "react";
import { feildsConfig, validateForm, validators } from "./authLogic";
import Input from "./input";
import { NavLink, useNavigate } from "react-router-dom";
import useFormHandlers from "./hooks";
import { useSelector } from "react-redux";
import { IoIosWarning } from "react-icons/io";
import LoadingLoader from "../../commons/loader";

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
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { loginHandler, handleInput, handleBlur } = useFormHandlers(
    formValues,
    setFormValues,
    errors,
    setErrors,
    touched,
    setTouched,
    setSuccess,
    setIsLoading,
  );
  const navigate = useNavigate();
  const auth = useSelector((state) => state.Auth);
  const timeoutKey = useRef(null);
  useEffect(() => {
    if (timeoutKey.current) {
      clearTimeout(timeoutKey.current);
    }

    if (success) {
      timeoutKey.current = setTimeout(() => {
        navigate("../login");
      }, 1300);
    }

    return () => {
      if (timeoutKey.current) clearTimeout(timeoutKey.current);
    };
  }, [success, navigate]);

  useEffect(() => {
    if (auth.isLoggedIn === true) navigate("../home");
  }, [auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Log in to your account
        </p>
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 rounded flex items-center justify-center z-10">
            <LoadingLoader size="lg" color="blue" />
          </div>
        )}
        <form noValidate onSubmit={loginHandler} className="space-y-5">
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
          {errors?.res && (
            <div className=" flex gap-2 items-center text-xs text-red-600 mt-1">
              <IoIosWarning />
              {errors.res}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Log in
          </button>
        </form>
        {success && (
          <div className=" mt-1 w-full bg-green-100 text-green-800 border-b border-green-300 px-4 py-3 text-center font-medium animate-slideDown">
            Logged in Successfully !
          </div>
        )}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <NavLink
            to="/signup"
            className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors"
          >
            Sign up
          </NavLink>
        </p>
      </div>
    </div>
  );
}
