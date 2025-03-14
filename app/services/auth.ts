export interface LoginCredentials {
  name: string;
  email: string;
}

export const login = async (credentials: LoginCredentials): Promise<void> => {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'login',
      credentials,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Login error:', error);
    throw new Error('Login failed');
  }
};

export const logout = async (): Promise<void> => {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'logout',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Logout error:', error);
    throw new Error('Logout failed');
  }
}; 