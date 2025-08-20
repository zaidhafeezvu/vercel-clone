const API_BASE_URL = 'http://localhost:3001/api';

class AuthClient {
  async signUp(data) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Sign up failed');
    }
    
    return response.json();
  }

  async signIn(data) {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Sign in failed');
    }
    
    return response.json();
  }

  async signOut() {
    const response = await fetch(`${API_BASE_URL}/auth/signout`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Sign out failed');
    }
    
    return response.json();
  }

  async getSession() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/session`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        return null;
      }
      
      return response.json();
    } catch (error) {
      return null;
    }
  }
}

export const authClient = new AuthClient();