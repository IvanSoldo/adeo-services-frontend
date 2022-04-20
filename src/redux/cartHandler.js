import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
};

export const cartHandlerSlice = createSlice({
  name: "cartHandler",
  initialState,
  reducers: {
    addToCart: (state, { payload }) => {
      const exist = state.cartItems.find(
        (x) =>
          x.itemIndex === payload.itemIndex && x.menuIndex === payload.menuIndex
      );

      if (exist) {
        for (let element of state.cartItems) {
          if (
            element.itemIndex === payload.itemIndex &&
            element.menuIndex === payload.menuIndex
          ) {
            element.quantity++;
          }
        }
      } else {
        state.cartItems.push(payload);
      }
      state.totalQuantity++;
      state.totalPrice += payload.item.price;
      return state;
    },
    deleteFromCart: (state, { payload }) => {
      const exist = state.cartItems.find(
        (x) =>
          x.itemIndex === payload.itemIndex && x.menuIndex === payload.menuIndex
      );

      if (exist.quantity === 1) {
        state = {
          ...state,
          cartItems: state.cartItems.filter(
            (x) =>
              x.itemIndex !== payload.itemIndex ||
              x.menuIndex !== payload.menuIndex
          ),
        };
      } else {
        for (let element of state.cartItems) {
          if (
            element.itemIndex === payload.itemIndex &&
            element.menuIndex === payload.menuIndex
          ) {
            element.quantity--;
          }
        }
      }
      state.totalQuantity--;
      state.totalPrice -= payload.price;
      return state;
    },
    emptyCart: (state, action) => {
      return initialState;
    },
  },
});

export const { addToCart, deleteFromCart, emptyCart } =
  cartHandlerSlice.actions;

export default cartHandlerSlice.reducer;
