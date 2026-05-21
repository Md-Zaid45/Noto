import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./home.jsx";
import appStore from "./store/appStore.js";
import { Provider } from "react-redux";
import LandingPage from "./pages/landinPage.jsx";
import Editr from "./features/notes/editor/editor.jsx";
import { AuthPage } from "./pages/signup-login.jsx";
import ContentLayout from "./features/layout/contentLayout.jsx";
import ErrorPage from "./pages/errorPage.jsx";
import { apiFetch } from "./commons/apifetch.js";
import  Dashboard  from "./pages/dashboard.jsx";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage />, errorElement: <ErrorPage /> },
  {
    path: "/home",
    element: <App/>,
    loader: async () => {
      const res = await apiFetch(`/workspace`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      console.log(data);
      return data;
    },
    children: [
      {
        path: "notes/:id",
        element: <ContentLayout />,
      },
      {
        path: "dashboard",
        element: <Dashboard/>
      }
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
  <Provider store={appStore}>
    <RouterProvider router={router} />
  </Provider>,
);
