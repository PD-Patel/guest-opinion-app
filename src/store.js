import { configureStore } from "@reduxjs/toolkit";
import emailListReducer from "./EmailListSlice";

const store = configureStore({
  reducer: {
    newEmail: emailListReducer,
  },
});

export default store;
