import { useLocation, useParams } from "react-router-dom";
import Login from "../features/auth/login";
import { SignUp } from "../features/auth/signup";

export function AuthPage() {
  const  location  = useLocation();
  const path=location.pathname.slice(1)
  console.log(path)
  return (
    <>
      {path==='signup' && <SignUp />}
      {path==='login' && <Login />}
    </>
  );
}
