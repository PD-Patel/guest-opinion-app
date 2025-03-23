import { createSlice } from "@reduxjs/toolkit";

export const emailListSlice = createSlice({
  name: "emailList",
  initialState: {
    value: JSON.parse(localStorage.getItem("emails")) || [],
  },
  reducers: {
    addEmail: (state, action) => {
      console.log("action >>>>", action.payload);
      console.log("Before Update:", state.value);
      state.value = [...state.value, action.payload];
      localStorage.setItem("emails", JSON.stringify(state.value));
      console.log("After Update:", state.value);
    },
  },
});

export const { addEmail } = emailListSlice.actions;

export default emailListSlice.reducer;
