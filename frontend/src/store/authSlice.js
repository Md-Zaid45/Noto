import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "isLoggedIn",
  initialState: {
    isAuthChecked: null,
    user: null,
    isLoggedIn: false,
  },
  reducers: {
    setLoggedIn: (state, action) => {
      console.log("authslice setloggedin", action.payload);
      state.isAuthChecked = true;
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    setLoggedOut: (state, action) => {
      state.user = null;
      state.isLoggedIn = false;
    },
    toggleIsAuthChecked: (state, action) => {
      state.isAuthChecked = !state.isAuthChecked;
    },
  },
});

export const { setLoggedIn, setLoggedOut } = authSlice.actions;
export default authSlice;
