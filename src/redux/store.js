import { configureStore } from "@reduxjs/toolkit";
import roomHandlerReducer from "./roomHandler";
import cartHandlerReducer from "./cartHandler";
import unProcessedOrdersReducer from "./unprocessedOrdersHandler";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistRoomHandlerConfig = {
  key: "roomHandler",
  version: 1,
  storage,
};

const persistedRoomHandler = persistReducer(
  persistRoomHandlerConfig,
  roomHandlerReducer
);

const persistCartHandlerConfig = {
  key: "cartHandler",
  version: 1,
  storage,
};

const persistedCartHandler = persistReducer(
  persistCartHandlerConfig,
  cartHandlerReducer
);

const persistUnprocessedOrdersHandlerConfig = {
  key: "ordersCountHandler",
  version: 1,
  storage,
};

const persistedUnprocessedOrderHandler = persistReducer(
  persistUnprocessedOrdersHandlerConfig,
  unProcessedOrdersReducer
);

const store = configureStore({
  reducer: {
    roomHandler: persistedRoomHandler,
    cartHandler: persistedCartHandler,
    orderHandler: persistedUnprocessedOrderHandler,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
