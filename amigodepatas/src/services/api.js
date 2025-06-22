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
    const errorBody = await response.text(); // salva o texto do erro na exceção
    const error = new Error(`Erro na requisição: ${response.status} - ${errorBody}`);
    error.response = response;
    error.body = errorBody;
    throw error;
  }

  return response.json();
};

export const authService = {
  // Usuário
  login: async (email, senha) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
  },

  register: async (userData) => {
    const userDTO = {
      nome: userData.nome,
      email: userData.email,
      senha: userData.senha,
      endereco: userData.endereco,
      telefone: userData.telefone,
    };

    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userDTO),
    });
  },

  updateUser: async (userData) => {
    return fetchAPI('/auth/update', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  getCurrentUser: async () => {
    return fetchAPI('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Animais
  getAnimais: async () => fetchAPI('/animais/list'),
  createAnimal: async (animalData) =>
      fetchAPI('/animais/create', {
        method: 'POST',
        body: JSON.stringify(animalData),
      }),
  updateAnimal: async (id, animalData) =>
      fetchAPI(`/animais/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(animalData),
      }),
  deleteAnimal: async (id) =>
      fetchAPI(`/animais/delete/${id}`, {
        method: 'DELETE',
      }),

  // Candidaturas (Applications)
  getCandidaturas: async () => fetchAPI('/applications'),
  approveCandidatura: async (id) =>
      fetchAPI(`/applications/${id}/approve`, { method: 'PUT' }),
  rejectCandidatura: async (id) =>
      fetchAPI(`/applications/${id}/reject`, { method: 'PUT' }),

  /**
   * Cria uma candidatura para adoção ou lar temporário
   * @param {Object} params
   * @param {string} params.animalId - UUID do animal
   * @param {string} params.type - "ADOCAO" ou "LAR_TEMPORARIO"
   * @param {string} [params.message] - mensagem opcional
   */
  criarCandidatura: async ({ animalId, type = "ADOCAO", message = "" }) => {
    return fetchAPI('/applications', {
      method: 'POST',
      body: JSON.stringify({ animalId, type, message }),
    });
  },

  getMinhasCandidaturas: async () => fetchAPI('/applications/mine'),

  deleteCandidatura: async (id) => {
    const res = await fetch(`/applications/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao descartar');
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

export default authService;
