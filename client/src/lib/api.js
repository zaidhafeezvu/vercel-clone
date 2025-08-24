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
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || response.statusText;
      } catch {
        errorMessage = errorText || response.statusText;
      }
      throw new Error(`API Error: ${errorMessage}`);
    }
    
    return response.json();
  },

  async postFormData(endpoint, formData, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      ...options,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || response.statusText;
      } catch {
        errorMessage = errorText || response.statusText;
      }
      throw new Error(`API Error: ${errorMessage}`);
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

  createDeploymentWithFile(projectId, file, data = {}) {
    const formData = new FormData();
    formData.append('projectFile', file);
    formData.append('commitMessage', data.commitMessage || `Deploy from uploaded ZIP: ${file.name}`);
    
    return this.postFormData(`/projects/${projectId}/deploy`, formData);
  },

  getPackageManagers() {
    return this.get('/package-managers');
  },
};