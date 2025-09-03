import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { todoReducer, authReducer } from "../ReduxStore/Reducers";

const persistConfig = { key: "root", storage };

const persistedTodoReducer = persistReducer(persistConfig, todoReducer);
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    todos: persistedTodoReducer,
    auth: persistedAuthReducer,
  },
});

export const persistor = persistStore(store);
