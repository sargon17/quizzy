import { createSlice } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    userName: "user",
    email: "",
    _id: "",
  },
  reducers: {
    setUserData: (state, action) => {
      state.userName = action.payload.userName;
      state.email = action.payload.email;
      state._id = action.payload._id;
    },
    deleteUserData: (state) => {
      state.userName = "";
      state.email = "";
      state._id = "";
    },
  },
});

export const { setUserData, deleteUserData } = userDataSlice.actions;
export const userDataSelector = (state) => state.userData;
export default userDataSlice.reducer;
