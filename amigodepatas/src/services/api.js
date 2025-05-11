// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Função auxiliar para fazer requisições
const fetchAPI = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Adiciona o token de autenticação se existir
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
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Erro na requisição');
  }

  return response.json();
};

// Serviços de autenticação
export const authService = {
  // Login
  login: async (email, senha) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },

  // Registro
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

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },

  // Verificar se o usuário está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Teste de conexão com o backend
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