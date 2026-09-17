import { useState } from "react";
import Input from "./input";
import { feildsConfig } from "./authLogic";
import { NavLink, useNavigate } from "react-router-dom";
import useFormHandlers from "./hooks";
import { IoIosWarning } from "react-icons/io";
import LoadingLoader from "../../commons/loader";
import { toast } from "../../hooks/use-toast";

export function SignUp() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    Name: "",
    Email: "",
    CreatePassword: "",
    ConfirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
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
    setTouched,
    () => {
      toast({ title: "Registered Successfully!", variant: "success" });
      setTimeout(() => navigate("../login"), 1300);
    },
    setIsLoading,
  );
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-stone-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-stone-800 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-stone-100 text-center mb-2">
          Create an account
        </h1>
        <p className="text-sm text-gray-500 dark:text-stone-400 text-center mb-6">
          Start building your knowledge base
        </p>
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-stone-900/80 rounded flex items-center justify-center z-10">
            <LoadingLoader size="lg" color="green" />
          </div>
        )}
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
          {errors?.res && (
            <div className=" flex gap-2 items-center text-xs text-red-600 mt-1">
              <IoIosWarning />
              {errors.res}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-stone-400 mt-6">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-emerald-600 font-medium hover:text-emerald-500 transition-colors"
          >
            Log in
          </NavLink>
        </p>
      </div>
    </div>
  );
}
