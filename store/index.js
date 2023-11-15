import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { apiSlice } from "./feature/api/apiSlice";
import { productApiSlice } from "./feature/service/productApiSlice";
import { loginApiSlice } from "./feature/service/loginApiSlice";

// const logger = createLogger();
export const reducer = combineReducers({
  [productApiSlice.reducerPath]: productApiSlice.reducer,
  [loginApiSlice.reducerPath]: loginApiSlice.reducer,
});

export const createStore = () =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
      // if (isDevelopment()) {
      // return getDefaultMiddleware().concat(apiSlice.middleware).concat(logger);
      // }
      return getDefaultMiddleware().concat(apiSlice.middleware);
    },
  });

export const store = createStore();

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
