import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProjectService from "../services/projectService";
import TaskService from "../services/taskService";

// ==================== ASYNC THUNKS ====================

// Project Async Thunks
export const fetchProjects = createAsyncThunk(
  "todos/fetchProjects",
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
  "todos/createProject",
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
  "todos/deleteProject",
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
  "todos/updateProject",
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
  "todos/fetchProjectTasks",
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
  "todos/createTask",
  async ({ projectId, taskData }, { rejectWithValue }) => {
    try {
      const taskPayload = {
        ...taskData,
        projectId: projectId,
        title: taskData.text || taskData.title,
      };
      const task = await TaskService.createTask(taskPayload);
      return { projectId, task };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "todos/updateTask",
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
  "todos/deleteTask",
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
  "todos/toggleTask",
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
  "todos/fetchActivityFeed",
  async ({ limit = 15, page = 1 } = {}, { rejectWithValue }) => {
    try {
      const activities = await TaskService.getActivityFeed(limit, page);
      return activities;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ==================== INITIAL STATE ====================

const todoInitialState = {
  // Project data
  todoBoxes: [],
  todos: {},
  
  // Activity feed - limited size
  activityFeed: [],
  
  // Loading states
  loading: false,
  tasksLoading: false,
  activityLoading: false,
  
  // Error states
  error: null,
  tasksError: null,
  activityError: null,
};

// ==================== HELPER FUNCTIONS ====================

const addActivity = (state, activity) => {
  // Only add if it's not a duplicate
  const isDuplicate = state.activityFeed.some(
    (item) => 
      item.type === activity.type && 
      item.task === activity.task && 
      item.projectId === activity.projectId &&
      Math.abs(new Date(item.timestamp) - new Date(activity.timestamp)) < 1000
  );
  
  if (!isDuplicate) {
    state.activityFeed.unshift(activity);
    // Keep only last 15 activities
    if (state.activityFeed.length > 15) {
      state.activityFeed = state.activityFeed.slice(0, 15);
    }
  }
};

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
  updatedAt: backendProject.updatedAt,
});

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
  completedAt: backendTask.completedAt,
});

const getProjectTitle = (state, projectId) => {
  const project = state.todoBoxes.find((p) => p.id === projectId);
  return project ? project.title : "Unknown project";
};

// ==================== TODO SLICE ====================

const todoSlice = createSlice({
  name: "todos",
  initialState: todoInitialState,
  reducers: {
    // Local actions - only for offline/fallback scenarios
    addTodo: (state, action) => {
      const { boxId, text } = action.payload;
      if (!state.todos[boxId]) state.todos[boxId] = [];

      const newTask = { 
        id: `temp_${Date.now()}`, // Temporary ID for local tasks
        text, 
        completed: false,
        createdAt: new Date().toISOString()
      };
      state.todos[boxId].push(newTask);

      // Only add activity for local tasks (not API tasks)
      addActivity(state, {
        id: `activity_${Date.now()}`,
        type: "task_created",
        task: newTask.text,
        projectId: boxId,
        projectName: getProjectTitle(state, boxId),
        timestamp: new Date().toISOString(),
      });
    },

    toggleTodo: (state, action) => {
      const { boxId, todoId } = action.payload;
      if (state.todos[boxId]) {
        state.todos[boxId] = state.todos[boxId].map((todo) => {
          if (todo.id === todoId) {
            const updated = { ...todo, completed: !todo.completed };
            
            // Only add activity for local toggles
            addActivity(state, {
              id: `activity_${Date.now()}`,
              type: updated.completed ? "task_completed" : "task_reopened",
              task: updated.text,
              projectId: boxId,
              projectName: getProjectTitle(state, boxId),
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
          addActivity(state, {
            id: `activity_${Date.now()}`,
            type: "task_deleted",
            task: taskToDelete.text,
            projectId: boxId,
            projectName: getProjectTitle(state, boxId),
            timestamp: new Date().toISOString(),
          });
        }
      }
    },

    addTodoBox: (state, action) => {
      const newBoxId = `temp_${Date.now()}`;
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
        color: colors[state.todoBoxes.length % colors.length],
        createdAt: new Date().toISOString(),
      };
      
      state.todoBoxes.push(newProject);
      state.todos[newBoxId] = [];

      addActivity(state, {
        id: `activity_${Date.now()}`,
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
          id: `activity_${Date.now()}`,
          type: "project_deleted",
          task: projectToDelete.title,
          projectId: boxId,
          projectName: projectToDelete.title,
          timestamp: new Date().toISOString(),
        });
      }
    },

    // Utility actions
    clearError: (state) => {
      state.error = null;
      state.tasksError = null;
      state.activityError = null;
    },

    clearActivityFeed: (state) => {
      state.activityFeed = [];
    },

    // Reset state on logout
    resetTodoState: (state) => {
      Object.assign(state, todoInitialState);
    },
  },

  extraReducers: (builder) => {
    builder
      // ==================== PROJECTS ====================
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        
        // Sort by createdAt (oldest first)
        const sortedProjects = [...action.payload].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        state.todoBoxes = sortedProjects.map(convertProjectFormat);

        // Preserve existing todos but ensure all projects have todo arrays
        sortedProjects.forEach((project) => {
          const projectId = project._id;
          if (!state.todos[projectId]) {
            state.todos[projectId] = [];
          }
        });

        // Clean up todos for deleted projects
        const currentProjectIds = sortedProjects.map(p => p._id);
        Object.keys(state.todos).forEach(projectId => {
          if (!currentProjectIds.includes(projectId) && !projectId.startsWith('temp_')) {
            delete state.todos[projectId];
          }
        });
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch projects";
      })

      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        const newProject = convertProjectFormat(action.payload);

        // Insert in sorted order
        const insertIndex = state.todoBoxes.findIndex(
          (p) => new Date(p.createdAt) > new Date(newProject.createdAt)
        );
        
        if (insertIndex === -1) {
          state.todoBoxes.push(newProject);
        } else {
          state.todoBoxes.splice(insertIndex, 0, newProject);
        }

        state.todos[newProject.id] = [];
        
        // Activity is handled by the backend, don't add local activity
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create project";
      })

      .addCase(deleteProjectAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProjectAsync.fulfilled, (state, action) => {
        state.loading = false;
        const projectId = action.payload;
        
        state.todoBoxes = state.todoBoxes.filter((box) => box.id !== projectId);
        delete state.todos[projectId];
        
        // Activity is handled by the backend
      })
      .addCase(deleteProjectAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete project";
      })

      .addCase(updateProject.fulfilled, (state, action) => {
        const updatedProject = convertProjectFormat(action.payload);
        const index = state.todoBoxes.findIndex(
          (box) => box.id === updatedProject.id
        );
        if (index !== -1) {
          state.todoBoxes[index] = updatedProject;
        }
      })

      // ==================== TASKS ====================
      .addCase(fetchProjectTasks.pending, (state) => {
        state.tasksLoading = true;
        state.tasksError = null;
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.tasksLoading = false;
        const { projectId, tasks } = action.payload;
        
        // Only update if we actually got tasks from the API
        if (Array.isArray(tasks)) {
          state.todos[projectId] = tasks.map(convertTaskFormat);
        }
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.tasksLoading = false;
        state.tasksError = action.payload || "Failed to fetch tasks";
      })

      .addCase(createTask.pending, (state) => {
        state.tasksLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasksLoading = false;
        const { projectId, task } = action.payload;
        
        if (!state.todos[projectId]) state.todos[projectId] = [];
        
        const convertedTask = convertTaskFormat(task);
        state.todos[projectId].push(convertedTask);
        
        // Activity handled by backend
      })
      .addCase(createTask.rejected, (state, action) => {
        state.tasksLoading = false;
        state.tasksError = action.payload || "Failed to create task";
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = convertTaskFormat(action.payload);
        const projectId = updatedTask.project;
        
        if (state.todos[projectId]) {
          const taskIndex = state.todos[projectId].findIndex(
            (task) => task.id === updatedTask.id
          );
          if (taskIndex !== -1) {
            state.todos[projectId][taskIndex] = updatedTask;
          }
        }
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        const { taskId, projectId } = action.payload;
        
        if (state.todos[projectId]) {
          state.todos[projectId] = state.todos[projectId].filter(
            (task) => task.id !== taskId
          );
        }
      })

      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        const { projectId, task } = action.payload;
        const updatedTask = convertTaskFormat(task);
        
        if (state.todos[projectId]) {
          const taskIndex = state.todos[projectId].findIndex(
            (t) => t.id === updatedTask.id
          );
          if (taskIndex !== -1) {
            state.todos[projectId][taskIndex] = updatedTask;
          }
        }
      })

      // ==================== ACTIVITY FEED ====================
      .addCase(fetchActivityFeed.pending, (state) => {
        state.activityLoading = true;
        state.activityError = null;
      })
      .addCase(fetchActivityFeed.fulfilled, (state, action) => {
        state.activityLoading = false;
        
        // Replace activity feed with fresh data from backend
        state.activityFeed = action.payload.map((activity) => ({
          id: activity._id,
          type: activity.type,
          task: activity.task,
          projectId: activity.projectId,
          projectName: activity.projectName,
          timestamp: activity.createdAt,
        })).slice(0, 15); // Limit to 15 items
      })
      .addCase(fetchActivityFeed.rejected, (state, action) => {
        state.activityLoading = false;
        state.activityError = action.payload || "Failed to fetch activity feed";
      });
  },
});

// ==================== AUTH SLICE ====================

const authInitialState = { 
  user: null, 
  token: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

// ==================== EXPORTS ====================

export const todoReducer = todoSlice.reducer;
export const authReducer = authSlice.reducer;

// Todo actions
export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  addTodoBox,
  deleteTodoBox,
  clearError,
  clearActivityFeed,
  resetTodoState,
} = todoSlice.actions;

// Auth actions
export const { 
  setUser, 
  logout,
  setAuthLoading,
  setAuthError,
  clearAuthError
} = authSlice.actions;