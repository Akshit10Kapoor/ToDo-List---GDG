const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'http://localhost:5000/api';

class ProjectService {
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

  // Get all projects
  async getAllProjects() {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch projects');
      }

      return data.projects;
    } catch (error) {
      console.error('Get projects error:', error);
      throw error;
    }
  }

  // Create new project
  async createProject(projectData) {
    try {
      // Add color selection if not provided
      const colors = [
        "bg-green-100",
        "bg-yellow-100", 
        "bg-red-100",
        "bg-blue-100",
        "bg-purple-100",
        "bg-pink-100",
      ];
      
      const dataWithColor = {
        ...projectData,
        color: projectData.color || colors[Date.now() % colors.length]
      };

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(dataWithColor),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create project');
      }

      return data.project;
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  }

  // Get single project
  async getProject(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch project');
      }

      return data.project;
    } catch (error) {
      console.error('Get project error:', error);
      throw error;
    }
  }

  // Update project
  async updateProject(projectId, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update project');
      }

      return data.project;
    } catch (error) {
      console.error('Update project error:', error);
      throw error;
    }
  }

  // Delete project
  async deleteProject(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to delete project');
      }

      return true;
    } catch (error) {
      console.error('Delete project error:', error);
      throw error;
    }
  }

  // Add collaborator
  async addCollaborator(projectId, userEmail, role = 'editor') {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/collaborators`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ userEmail, role }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to add collaborator');
      }

      return data.project;
    } catch (error) {
      console.error('Add collaborator error:', error);
      throw error;
    }
  }

  // Remove collaborator
  async removeCollaborator(projectId, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/collaborators/${userId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to remove collaborator');
      }

      return data.project;
    } catch (error) {
      console.error('Remove collaborator error:', error);
      throw error;
    }
  }

  // Get project statistics
  async getProjectStats(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch project stats');
      }

      return data.stats;
    } catch (error) {
      console.error('Get project stats error:', error);
      throw error;
    }
  }
}

export default new ProjectService();