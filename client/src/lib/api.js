const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  async get(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },

  async post(endpoint, data, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Project methods
  getProjects() {
    return this.get('/projects');
  },

  createProject(project) {
    return this.post('/projects', project);
  },

  getDeployments(projectId) {
    return this.get(`/projects/${projectId}/deployments`);
  },

  createDeployment(projectId, data) {
    return this.post(`/projects/${projectId}/deploy`, data);
  },
};