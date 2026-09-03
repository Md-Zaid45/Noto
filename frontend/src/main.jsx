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
import ErrorPage from "./pages/errorPage.jsx";
import { apiFetch } from "./commons/apifetch.js";
import Dashboard from "./pages/dashboard.jsx";
import CardsPage from "./pages/revision.jsx";
import ReviewFlashcard from "./features/flashcards/reviewFlashcard.jsx";
import Quiz from "./features/quiz/quiz.jsx";
const router = createBrowserRouter([
  { path: "/", element: <LandingPage />, errorElement: <ErrorPage /> },
  {
    path: "/home",
    element: <App />,
    loader: async () => {
      const res = await apiFetch(`/workspace`, {
        method: "POST",
        body: JSON.parse(localStorage.getItem("tabs")),
      });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      console.log(data);
      return data;
    },
    shouldRevalidate() {
      return false;
    },
    children: [
      {
        path: "notes/:id",
        element: <Editr />,
      },
      {
        path: "cards",
        element: <CardsPage />,
      },
      {
        path: "cards/:id",
        element: <CardsPage />,
      },
      {
        path:'cards/manage/:id',
        element:<Manage/>
      },
      {
        path: "cards/review/:id",
        element: <ReviewFlashcard/>
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "quiz",
        element: <Dashboard />,
      },
      {
        path: "quiz/:id",
        element: <Quiz />,
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

import { ThemeProvider } from "./store/themeContext.jsx";
import Manage from "./features/flashcards/manage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
