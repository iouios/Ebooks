import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./bookSlice"; // นำเข้า Reducer ที่สร้างไว้


export const store = configureStore({
  reducer: {
    books: bookReducer,
  },
});

// สร้างประเภทของ RootState
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
