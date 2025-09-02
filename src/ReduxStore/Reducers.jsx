import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todoBoxes: [],
  todos: {},
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodoBox: (state, action) => {
      const newBoxId = Date.now();
      state.todoBoxes.push({
        id: newBoxId,
        title: action.payload?.title || "Todo List",
        subtitle: action.payload?.subtitle || "",
      });
      state.todos[newBoxId] = [];
    },
  },
});

export const { addTodoBox, addTodo, toggleTodo, deleteTodo } =
  todoSlice.actions;
export default todoSlice.reducer;


