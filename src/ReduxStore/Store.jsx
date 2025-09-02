import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../ReduxStore/Reducers';

export const store = configureStore({
  reducer: {
    todos: todoReducer
  }
});