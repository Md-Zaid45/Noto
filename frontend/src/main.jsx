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
    loader: async () => {
      const res = await fetch("http://localhost:8000/api/v1/users/workspace", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      return data;
    },
    children: [
      {
        path: "notes/:id",
        element: <Editr/>,
      },
    ],
  },
  {
    path: "/signup",
    element: <AuthPage />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  //  <StrictMode>
  <Provider store={appStore}>
    <RouterProvider router={router} />
  </Provider>,
  //  </StrictMode>
);
