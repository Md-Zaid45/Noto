import { useDispatch } from "react-redux";
import { setLoggedIn } from "../store/authSlice";
import appStore from "../store/appStore";

const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (url, options = {}) => {
  let response = await fetch(url, {
    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },

    ...options,

    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    const refreshRes = await fetch(`${API_URL}/api/v1/users/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      appStore.dispatch(setLoggedIn(data.payload.name));
      response = await fetch(url, {
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },

        ...options,

        body: options.body ? JSON.stringify(options.body) : undefined,
      });
    } else {
      appStore.dispatch(setLoggedIn(false));
      appStore.dispatch(toggleIsAuthChecked(false));
      console.log("failed req in apifetch");
      return;
    }
  }
  console.log("apifetch response return", response);

  return response;
};
