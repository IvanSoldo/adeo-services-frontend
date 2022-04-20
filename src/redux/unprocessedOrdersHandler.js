import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: "",
};

export const unprocessedOrderHandlerSlice = createSlice({
  name: "unprocessedOrderHandler",
  initialState,
  reducers: {
    updateCount: (state, { payload }) => {
      state.count = payload;
      return state;
    },
    decrementCount: (state) => {
      state.count--;
      return state;
    },
    incrementCount: (state) => {
      state.count++;
      return state;
    },
  },
});

export const { updateCount, decrementCount, incrementCount } =
  unprocessedOrderHandlerSlice.actions;

export default unprocessedOrderHandlerSlice.reducer;
