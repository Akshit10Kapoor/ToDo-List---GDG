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
      const colors = [
        "bg-green-100",
        "bg-yellow-100",
        "bg-red-100",
        "bg-blue-100",
        "bg-purple-100",
        "bg-pink-100",
      ];

      state.todoBoxes.push({
        id: newBoxId,
        title: action.payload?.title || "Todo List",
        subtitle: action.payload?.subtitle || "",
        color: colors[newBoxId % colors.length],
      });

      state.todos[newBoxId] = [];
    },

    deleteTodoBox: (state, action) => {
      const boxId = action.payload;
      state.todoBoxes = state.todoBoxes.filter((box) => box.id !== boxId);
      delete state.todos[boxId];
    },
    addTodo: (state, action) => {
      const { boxId, text } = action.payload;
      if (!state.todos[boxId]) state.todos[boxId] = [];
      state.todos[boxId].push({
        id: Date.now(),
        text,
        completed: false,
      });
    },
    toggleTodo: (state, action) => {
      const { boxId, todoId } = action.payload;
      if (state.todos[boxId]) {
        state.todos[boxId] = state.todos[boxId].map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        );
      }
    },
    deleteTodo: (state, action) => {
      const { boxId, todoId } = action.payload;
      if (state.todos[boxId]) {
        state.todos[boxId] = state.todos[boxId].filter(
          (todo) => todo.id !== todoId
        );
      }
    },
  },
});

export const { addTodoBox, addTodo, toggleTodo, deleteTodo, deleteTodoBox } =
  todoSlice.actions;
export default todoSlice.reducer;
