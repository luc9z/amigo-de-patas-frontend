import { v4 as uuidv4 } from 'uuid';

// Função auxiliar para gerar um número inteiro aleatório
const generateRandomId = () => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
};

// Serviços de autenticação
export const authService = {
  // ... existing code ...

  // Registro
  register: async (userData) => {
    const userDTO = {
      id: generateRandomId(), // Gera um número inteiro aleatório para o ID
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

  // ... existing code ...
}; 