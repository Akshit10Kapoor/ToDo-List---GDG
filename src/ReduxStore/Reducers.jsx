import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProjectService from "../services/projectService";
import TaskService from "../services/taskService";

// Project Async Thunks
export const fetchProjects = createAsyncThunk(
  'todos/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const projects = await ProjectService.getAllProjects();
      return projects;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  'todos/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const project = await ProjectService.createProject(projectData);
      return project;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProjectAsync = createAsyncThunk(
  'todos/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await ProjectService.deleteProject(projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'todos/updateProject',
  async ({ projectId, updates }, { rejectWithValue }) => {
    try {
      const project = await ProjectService.updateProject(projectId, updates);
      return project;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Task Async Thunks
export const fetchProjectTasks = createAsyncThunk(
  'todos/fetchProjectTasks',
  async (projectId, { rejectWithValue }) => {
    try {
      const tasks = await TaskService.getProjectTasks(projectId);
      return { projectId, tasks };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'todos/createTask',
  async ({ projectId, taskData }, { rejectWithValue }) => {
    try {
      const taskPayload = {
        ...taskData,
        projectId: projectId,
        title: taskData.text || taskData.title // Handle both text and title
      };
      const task = await TaskService.createTask(taskPayload);
      return { projectId, task };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'todos/updateTask',
  async ({ taskId, updates }, { rejectWithValue }) => {
    try {
      const task = await TaskService.updateTask(taskId, updates);
      return task;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'todos/deleteTask',
  async ({ taskId, projectId }, { rejectWithValue }) => {
    try {
      await TaskService.deleteTask(taskId);
      return { taskId, projectId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleTaskCompletion = createAsyncThunk(
  'todos/toggleTask',
  async ({ taskId, projectId }, { rejectWithValue }) => {
    try {
      const task = await TaskService.toggleTask(taskId);
      return { projectId, task };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchActivityFeed = createAsyncThunk(
  'todos/fetchActivityFeed',
  async ({ limit = 20, page = 1 } = {}, { rejectWithValue }) => {
    try {
      const activities = await TaskService.getActivityFeed(limit, page);
      return activities;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const todoInitialState = {
  todoBoxes: [],
  todos: {},
  activityFeed: [],
  loading: false,
  error: null,
  tasksLoading: false,
  tasksError: null,
};

const addActivity = (state, activity) => {
  state.activityFeed.unshift(activity);
  if (state.activityFeed.length > 15) {
    state.activityFeed.pop();
  }
};

// Helper function to convert backend project to frontend format
const convertProjectFormat = (backendProject) => ({
  id: backendProject._id,
  title: backendProject.title,
  subtitle: backendProject.description || "",
  color: backendProject.color,
  status: backendProject.status,
  priority: backendProject.priority,
  dueDate: backendProject.dueDate,
  tasksCount: backendProject.tasksCount,
  completedTasksCount: backendProject.completedTasksCount,
  owner: backendProject.owner,
  collaborators: backendProject.collaborators,
  createdAt: backendProject.createdAt,
  updatedAt: backendProject.updatedAt
});

// Helper function to convert backend task to frontend format
const convertTaskFormat = (backendTask) => ({
  id: backendTask._id,
  text: backendTask.title,
  title: backendTask.title,
  description: backendTask.description,
  completed: backendTask.completed,
  status: backendTask.status,
  priority: backendTask.priority,
  dueDate: backendTask.dueDate,
  tags: backendTask.tags,
  assignedTo: backendTask.assignedTo,
  createdBy: backendTask.createdBy,
  project: backendTask.project,
  order: backendTask.order,
  createdAt: backendTask.createdAt,
  updatedAt: backendTask.updatedAt,
  completedAt: backendTask.completedAt
});

const todoSlice = createSlice({
  name: "todos",
  initialState: todoInitialState,
  reducers: {
    // Keep existing local reducers for backward compatibility and offline functionality
    addTodo: (state, action) => {
      const { boxId, text } = action.payload;
      if (!state.todos[boxId]) state.todos[boxId] = [];

      const newTask = {
        id: Date.now(),
        text,
        completed: false,
      };

      state.todos[boxId].push(newTask);
      const project = state.todoBoxes.find((p) => p.id === boxId);

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
            const project = state.todoBoxes.find((p) => p.id === boxId);

            addActivity(state, {
              id: Date.now(),
              type: updated.completed ? "task_completed" : "task_reopened",
              task: updated.text,
              projectId: boxId,
              projectName: project ? project.title : "Unknown project",
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
        const project = state.todoBoxes.find((p) => p.id === boxId);

        state.todos[boxId] = state.todos[boxId].filter(
          (todo) => todo.id !== todoId
        );

        if (taskToDelete) {
          addActivity(state, {
            id: Date.now(),
            type: "task_deleted",
            task: taskToDelete.text,
            projectId: boxId,
            projectName: project ? project.title : "Unknown project",
            timestamp: new Date().toISOString(),
          });
        }
      }
    },

    clearError: (state) => {
      state.error = null;
      state.tasksError = null;
    },

    // Local-only project creation (fallback)
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

      addActivity(state, {
        id: Date.now(),
        type: "project_created",
        task: newProject.title,
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
        addActivity(state, {
          id: Date.now(),
          type: "project_deleted",
          task: projectToDelete.title,
          projectId: boxId,
          projectName: projectToDelete.title,
          timestamp: new Date().toISOString(),
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.todoBoxes = action.payload.map(convertProjectFormat);
        // Initialize todos object for each project
        action.payload.forEach(project => {
          if (!state.todos[project._id]) {
            state.todos[project._id] = [];
          }
        });
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        const newProject = convertProjectFormat(action.payload);
        state.todoBoxes.push(newProject);
        state.todos[newProject.id] = [];

        addActivity(state, {
          id: Date.now(),
          type: "project_created",
          task: newProject.title,
          projectId: newProject.id,
          projectName: newProject.title,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Project
      .addCase(deleteProjectAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProjectAsync.fulfilled, (state, action) => {
        state.loading = false;
        const projectId = action.payload;
        const projectToDelete = state.todoBoxes.find((box) => box.id === projectId);

        state.todoBoxes = state.todoBoxes.filter((box) => box.id !== projectId);
        delete state.todos[projectId];

        if (projectToDelete) {
          addActivity(state, {
            id: Date.now(),
            type: "project_deleted",
            task: projectToDelete.title,
            projectId: projectId,
            projectName: projectToDelete.title,
            timestamp: new Date().toISOString(),
          });
        }
      })
      .addCase(deleteProjectAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = convertProjectFormat(action.payload);
        const index = state.todoBoxes.findIndex((box) => box.id === updatedProject.id);
        
        if (index !== -1) {
          state.todoBoxes[index] = updatedProject;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Project Tasks
      .addCase(fetchProjectTasks.pending, (state) => {
        state.tasksLoading = true;
        state.tasksError = null;
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.tasksLoading = false;
        const { projectId, tasks } = action.payload;
        state.todos[projectId] = tasks.map(convertTaskFormat);
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.tasksLoading = false;
        state.tasksError = action.payload;
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.tasksLoading = true;
        state.tasksError = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasksLoading = false;
        const { projectId, task } = action.payload;
        
        if (!state.todos[projectId]) state.todos[projectId] = [];
        const convertedTask = convertTaskFormat(task);
        state.todos[projectId].push(convertedTask);

        const project = state.todoBoxes.find((p) => p.id === projectId);
        addActivity(state, {
          id: Date.now(),
          type: "task_created",
          task: convertedTask.text,
          projectId: projectId,
          projectName: project ? project.title : "Unknown project",
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(createTask.rejected, (state, action) => {
        state.tasksLoading = false;
        state.tasksError = action.payload;
      })

      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.tasksLoading = true;
        state.tasksError = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.tasksLoading = false;
        const updatedTask = convertTaskFormat(action.payload);
        const projectId = updatedTask.project;

        if (state.todos[projectId]) {
          const taskIndex = state.todos[projectId].findIndex(task => task.id === updatedTask.id);
          if (taskIndex !== -1) {
            state.todos[projectId][taskIndex] = updatedTask;
          }
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.tasksLoading = false;
        state.tasksError = action.payload;
      })

      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.tasksLoading = true;
        state.tasksError = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasksLoading = false;
        const { taskId, projectId } = action.payload;

        if (state.todos[projectId]) {
          const taskToDelete = state.todos[projectId].find(task => task.id === taskId);
          state.todos[projectId] = state.todos[projectId].filter(task => task.id !== taskId);

          if (taskToDelete) {
            const project = state.todoBoxes.find((p) => p.id === projectId);
            addActivity(state, {
              id: Date.now(),
              type: "task_deleted",
              task: taskToDelete.text,
              projectId: projectId,
              projectName: project ? project.title : "Unknown project",
              timestamp: new Date().toISOString(),
            });
          }
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.tasksLoading = false;
        state.tasksError = action.payload;
      })

      // Toggle Task Completion
      .addCase(toggleTaskCompletion.pending, (state) => {
        state.tasksLoading = true;
        state.tasksError = null;
      })
      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        state.tasksLoading = false;
        const { projectId, task } = action.payload;
        const updatedTask = convertTaskFormat(task);

        if (state.todos[projectId]) {
          const taskIndex = state.todos[projectId].findIndex(t => t.id === updatedTask.id);
          if (taskIndex !== -1) {
            state.todos[projectId][taskIndex] = updatedTask;

            const project = state.todoBoxes.find((p) => p.id === projectId);
            addActivity(state, {
              id: Date.now(),
              type: updatedTask.completed ? "task_completed" : "task_reopened",
              task: updatedTask.text,
              projectId: projectId,
              projectName: project ? project.title : "Unknown project",
              timestamp: new Date().toISOString(),
            });
          }
        }
      })
      .addCase(toggleTaskCompletion.rejected, (state, action) => {
        state.tasksLoading = false;
        state.tasksError = action.payload;
      })

      // Fetch Activity Feed
      .addCase(fetchActivityFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.activityFeed = action.payload.map(activity => ({
          id: activity._id,
          type: activity.type,
          task: activity.task,
          projectId: activity.projectId,
          projectName: activity.projectName,
          timestamp: activity.createdAt
        }));
      })
      .addCase(fetchActivityFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const authInitialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const todoReducer = todoSlice.reducer;
export const authReducer = authSlice.reducer;

export const { 
  addTodo, 
  toggleTodo, 
  deleteTodo, 
  addTodoBox, 
  deleteTodoBox,
  clearError 
} = todoSlice.actions;

export const { setUser, logout } = authSlice.actions;