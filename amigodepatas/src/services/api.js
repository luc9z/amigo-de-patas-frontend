const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const fetchAPI = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = new Error('Erro na requisição');
    error.response = response;
    throw error;
  }

  return response.json();
};

export const authService = {
  login: async (email, senha) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    return data;
  },

  register: async (userData) => {
    const userDTO = {
      nome: userData.nome,
      email: userData.email,
      senha: userData.senha,
    };

    const data = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userDTO),
    });
    return data;
  },

  updateUser: async (userData) => {
    const data = await fetchAPI('/auth/update-user', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getAnimais: async () => {
    return fetchAPI('/animais/list');
  },

  createAnimal: async (animalData) => {
    return fetchAPI('/animais/create', {
      method: 'POST',
      body: JSON.stringify(animalData),
    });
  },

  updateAnimal: async (id, animalData) => {
    return fetchAPI(`/animais/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(animalData),
    });
  },

  deleteAnimal: async (id) => {
    return fetchAPI(`/animais/delete/${id}`, {
      method: 'DELETE',
    });
  },

  testConnection: async () => {
    try {
      const data = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', senha: 'test' }),
      });
      return { success: true, data };
    } catch (error) {
      if (error.message.includes('401')) {
        return { success: true, message: 'Backend está funcionando' };
      }
      return { success: false, error: error.message };
    }
  },
};

// Exporta o serviço de autenticação
export default authService; 