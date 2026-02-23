import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./pages/home.jsx";
import appStore from "./store/appStore.js";
import { Provider } from "react-redux";
import LandingPage from "./pages/landinPage.jsx";
import Editr from "./features/notes/editor/editor.jsx";
import { AuthPage } from "./pages/signup-login.jsx";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    path: "/home",
    element: <App />,
    children: [{ path: "note/:id", element: <Editr /> }],
  },
  {
    path:"/signup-login",
    element:<AuthPage/>
  }
]);

createRoot(document.getElementById("root")).render(
  //  <StrictMode>
    <Provider store={appStore}>
      <RouterProvider router={router} />
    </Provider>
//  </StrictMode>
);
