import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./pages/home.jsx";
import appStore from "./store/appStore.js";
import {Provider} from 'react-redux'
const router = createBrowserRouter([{ path: "/", element: <App /> }]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
