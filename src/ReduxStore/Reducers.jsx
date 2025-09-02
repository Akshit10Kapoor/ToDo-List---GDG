import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todoBoxes: [],
  todos: {},
  activityFeed: [],
};

// helper to push activity with max length 15
const addActivity = (state, activity) => {
  state.activityFeed.unshift(activity); // newest first
  if (state.activityFeed.length > 15) {
    state.activityFeed.pop(); // remove last if > 15
  }
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

      const newProject = {
        id: newBoxId,
        title: action.payload?.title || "Todo List",
        subtitle: action.payload?.subtitle || "",
        color: colors[newBoxId % colors.length],
      };

      state.todoBoxes.push(newProject);
      state.todos[newBoxId] = [];

      // log activity
      addActivity(state, {
        id: Date.now(),
        type: "project_created",
        project: newProject.title,
        projectId: newBoxId,
         projectName: newProject.title,
        timestamp: new Date().toISOString(),
      });
    },

    deleteTodoBox: (state, action) => {
      const boxId = action.payload;
      const projectToDelete = state.todoBoxes.find((box) => box.id === boxId);

      state.todoBoxes = state.todoBoxes.filter((box) => box.id !== boxId);
      delete state.todos[boxId];

      if (projectToDelete) {
        // log activity
        addActivity(state, {
          id: Date.now(),
          type: "project_deleted",
          project: projectToDelete.title,
          projectId: boxId,
          projectName: projectToDelete.title,
          timestamp: new Date().toISOString(),
        });
      }
    },

    addTodo: (state, action) => {
      const { boxId, text } = action.payload;
      if (!state.todos[boxId]) state.todos[boxId] = [];

      const newTask = {
        id: Date.now(),
        text,
        completed: false,
      };

      state.todos[boxId].push(newTask);
      const project = state.todoBoxes.find(p => p.id === boxId);

      addActivity(state, {
        id: Date.now(),
        type: "task_created",
        task: newTask.text,
        projectId: boxId,
         projectName: project ? project.title : "Unknown project",
        timestamp: new Date().toISOString(),
      });
    },

    toggleTodo: (state, action) => {
      const { boxId, todoId } = action.payload;
      if (state.todos[boxId]) {
        state.todos[boxId] = state.todos[boxId].map((todo) => {
          if (todo.id === todoId) {
            const updated = { ...todo, completed: !todo.completed };

            // log activity
            addActivity(state, {
              id: Date.now(),
              type: updated.completed ? "task_completed" : "task_reopened",
              task: updated.text,
              projectId: boxId,
              timestamp: new Date().toISOString(),
            });

            return updated;
          }
          return todo;
        });
      }
    },

    deleteTodo: (state, action) => {
      const { boxId, todoId } = action.payload;
      if (state.todos[boxId]) {
        const taskToDelete = state.todos[boxId].find((t) => t.id === todoId);

        state.todos[boxId] = state.todos[boxId].filter(
          (todo) => todo.id !== todoId
        );

        if (taskToDelete) {
          // log activity
          addActivity(state, {
            id: Date.now(),
            type: "task_deleted",
            task: taskToDelete.text,
            projectId: boxId,
            timestamp: new Date().toISOString(),
          });
        }
      }
    },
  },
});

export const { addTodoBox, addTodo, toggleTodo, deleteTodo, deleteTodoBox } =
  todoSlice.actions;
export default todoSlice.reducer;
