// src/services/taskService.js
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'http://localhost:5000/api';

class TaskService {
  // Get auth token from storage (matching AuthService format)
  getToken() {
    return sessionStorage.getItem('authToken') || localStorage.getItem('token');
  }

  // Get auth headers
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Get all tasks for a specific project
  async getProjectTasks(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/project/${projectId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch tasks');
      }

      return data.tasks;
    } catch (error) {
      console.error('Get project tasks error:', error);
      throw error;
    }
  }

  // Get single task by ID
  async getTask(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch task');
      }

      return data.task;
    } catch (error) {
      console.error('Get task error:', error);
      throw error;
    }
  }

  // Create new task
  async createTask(taskData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create task');
      }

      return data.task;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  }

  // Update task
  async updateTask(taskId, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update task');
      }

      return data.task;
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  }

  // Delete task
  async deleteTask(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to delete task');
      }

      return taskId;
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  }

  // Toggle task completion
  async toggleTask(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/toggle`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to toggle task');
      }

      return data.task;
    } catch (error) {
      console.error('Toggle task error:', error);
      throw error;
    }
  }

  // Reorder tasks
  async reorderTasks(taskIds, projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/reorder`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ taskIds, projectId }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to reorder tasks');
      }

      return true;
    } catch (error) {
      console.error('Reorder tasks error:', error);
      throw error;
    }
  }

  // Get activity feed
  async getActivityFeed(limit = 20, page = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/activity/feed?limit=${limit}&page=${page}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch activity feed');
      }

      return data.activities;
    } catch (error) {
      console.error('Get activity feed error:', error);
      throw error;
    }
  }
}

export default new TaskService();