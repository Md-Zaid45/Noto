import { IoIosWarning } from "react-icons/io";
export default function Input({
  name,
  value,
  type,
  placeholder,
  handleInput,
  handleBlur,
  error,
  touched,
}) {
  return (
    <div>
      <input
        name={name}
        value={value}
        placeholder={placeholder}
        type={type}
        onChange={handleInput}
        onBlur={handleBlur}
        className={`w-full px-3 py-2 border rounded ${
          touched && error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {touched && error && (
        <div className=" flex gap-2 items-center text-xs text-red-600 mt-1"><IoIosWarning/>{error}</div>
      )}
    </div>
  );
}
