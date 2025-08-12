import { configureStore } from "@reduxjs/toolkit";
import listMovieSlice from "./../pages/HomeTemplate/ListMoviePage/slice";
import authSlice from "./authSlice";

export const store = configureStore({
  reducer: {
    listMovieSlice,
    authSlice,
  },
});
