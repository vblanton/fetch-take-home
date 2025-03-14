export interface LoginCredentials {
  name: string;
  email: string;
}

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

export const login = async (credentials: LoginCredentials): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Login error:', errorText);
    throw new Error('Login failed');
  }
};

export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Logout error:', errorText);
      throw new Error('Logout failed');
    }

    // Clear localStorage
    localStorage.removeItem('auth_state');
    localStorage.removeItem('dogFavorites');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}; 