import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";

import App from "./home.jsx";
import appStore from "./store/appStore.js";
import { Provider } from "react-redux";
import { ThemeProvider } from "./store/themeContext.jsx";
import { Toaster } from "./components/ui/toaster";
import { apiFetch } from "./commons/apifetch.js";
import ErrorPage from "./pages/errorPage.jsx";

// Helper for default exports
const lazyRoute = (importFn) => async () => {
  const module = await importFn();

  return {
    Component: module.default,
  };
};

const router = createBrowserRouter([
  // -------------------------
  // LANDING
  // -------------------------
  {
    path: "/",
    lazy: lazyRoute(() =>
      import("./pages/landinPage.jsx")
    ),
    errorElement: <ErrorPage />,
  },

  // -------------------------
  // HOME
  // -------------------------
  {
    path: "/home",
    element: <App />,

    loader: async () => {
      const res = await apiFetch(`/workspace`, {
        method: "POST",
        body: JSON.parse(
          localStorage.getItem("tabs") ||
            '{"tabs":[],"activeTab":null}'
        ),
      });

      const data = await res.json();

      return data;
    },

    shouldRevalidate() {
      return false;
    },

    children: [
      // -------------------------
      // NOTES
      // -------------------------
      {
        path: "notes/:id",
        lazy: lazyRoute(() =>
          import("./features/notes/editor/editor.jsx")
        ),
      },

      // -------------------------
      // CARDS
      // -------------------------
      {
        path: "cards",
        lazy: lazyRoute(() =>
          import("./pages/revision.jsx")
        ),
      },

      {
        path: "cards/:id",
        lazy: lazyRoute(() =>
          import("./pages/revision.jsx")
        ),
      },

      // -------------------------
      // MANAGE CARDS
      // -------------------------
      {
        path: "cards/manage/:id",
        lazy: lazyRoute(() =>
          import("./features/flashcards/manage.jsx")
        ),
      },

      // -------------------------
      // REVIEW FLASHCARD
      // -------------------------
      {
        path: "cards/review/:id",
        lazy: lazyRoute(() =>
          import("./features/flashcards/reviewFlashcard.jsx")
        ),
      },

      // -------------------------
      // DASHBOARD
      // -------------------------
      {
        path: "dashboard",

        lazy: lazyRoute(() =>
          import("./pages/dashboard.jsx")
        ),

        children: [
          {
            index: true,

            lazy: async () => {
              const module = await import(
                "./pages/dashboard.jsx"
              );

              return {
                Component: module.DashboardHome,
              };
            },
          },

          {
            path: "deck-stats",

            lazy: lazyRoute(() =>
              import("./features/dashboard/deckStats.jsx")
            ),
          },
        ],
      },

      // -------------------------
      // PROFILE
      // -------------------------
      {
        path: "profile",

        lazy: lazyRoute(() =>
          import("./pages/profile.jsx")
        ),
      },

      // -------------------------
      // QUIZ
      // -------------------------
      {
        path: "quiz",

        lazy: lazyRoute(() =>
          import("./pages/revision.jsx")
        ),
      },

      {
        path: "quiz/:id",

        lazy: lazyRoute(() =>
          import("./features/quiz/quiz.jsx")
        ),
      },
    ],
  },

  // -------------------------
  // AUTH
  // -------------------------

  {
    path: "/signup",

    lazy: async () => {
      const module = await import(
        "./pages/signup-login.jsx"
      );

      return {
        Component: module.AuthPage,
      };
    },
  },

  {
    path: "/login",

    lazy: async () => {
      const module = await import(
        "./pages/signup-login.jsx"
      );

      return {
        Component: module.AuthPage,
      };
    },
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);