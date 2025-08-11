import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "@/lib/Features/Auth/authSlice";
import YachtsReducer from "@/lib/Features/Yachts/yachtsSlice";
import BlogReducer from "@/lib/Features/Blog/blogSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: AuthReducer,
      yachts: YachtsReducer,
      blog: BlogReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};


export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];