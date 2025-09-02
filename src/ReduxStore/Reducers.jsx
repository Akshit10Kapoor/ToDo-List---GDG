import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  todoBoxes: [],
  todos: {}
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodoBox: (state) => {
      const newBoxId = Date.now();
      state.todoBoxes.push(newBoxId);
      state.todos[newBoxId] = [];
    },
    addTodo: (state, action) => {
      const { boxId, text } = action.payload;
      state.todos[boxId].push({
        id: Date.now(),
        text,
        completed: false
      });
    },
    toggleTodo: (state, action) => {
      const { boxId, todoId } = action.payload;
      const todo = state.todos[boxId].find(todo => todo.id === todoId);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action) => {
      const { boxId, todoId } = action.payload;
      state.todos[boxId] = state.todos[boxId].filter(todo => todo.id !== todoId);
    }
  }
});

export const { addTodoBox, addTodo, toggleTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer; 
