import { configureStore } from "@reduxjs/toolkit";

import { userDataSlice } from "../features/user/userDataSlice";

export default configureStore({
  reducer: {
    userData: userDataSlice.reducer,
  },
});
