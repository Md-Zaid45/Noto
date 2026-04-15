import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name:'isLoggedIn',
  initialState:{
    user:null,
    isLoggedIn:false
  },
  reducers:{
    setLoggedIn:(state, action)=>{
      state.user = action.payload,
      state.isLoggedIn = true
    },
    setLoggedOut:(state, action)=>{
      state.user = null,
      state.isLoggedIn = false
    }
  }
}) 

export const {setLoggedIn,setLoggedOut} = authSlice.actions
export default authSlice