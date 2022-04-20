import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomNumber: "",
  roomId: "",
};

export const roomHandlerSlice = createSlice({
  name: "roomHandler",
  initialState,
  reducers: {
    handleRoom: (state, { payload }) => {
      state.roomNumber = payload.roomNumber;
      state.roomId = payload.roomId;
      return state;
    },
  },
});

export const { handleRoom } = roomHandlerSlice.actions;

export default roomHandlerSlice.reducer;
