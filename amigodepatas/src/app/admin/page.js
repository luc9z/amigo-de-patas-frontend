'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { authService } from '@/services/api';

export default function AdminPage() {
  const router = useRouter();
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    especie: 'cachorro',
    porte: 'medio',
    sexo: 'macho',
    descricao: '',
    imagemUrl: '',
    vacinado: false,
    castrado: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLogin, setAdminLogin] = useState({ email: '', senha: '' });
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchAnimais();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoginError('');
    setAdminLoading(true);
    try {
      const loginData = await authService.login(adminLogin.email, adminLogin.senha);
      console.log('Resposta do login:', loginData);
      console.log('Tentando salvar token:', loginData.token);
      console.log('window:', typeof window);
      if (typeof window !== 'undefined' && loginData.token) {
        localStorage.setItem('token', loginData.token);
        console.log('Token salvo:', loginData.token);
      } else {
        console.log('Token não encontrado na resposta!');
      }
      const response = await authService.checkAdminRole();
      if (response.isAdmin) {
        setIsAdmin(true);
        setError('');
      } else {
        setAdminLoginError('Apenas administradores podem acessar esta área.');
        authService.logout();
      }
    } catch (err) {
      setAdminLoginError('Credenciais inválidas ou sem permissão de administrador.');
      authService.logout();
    } finally {
      setAdminLoading(false);
    }
  };

  const fetchAnimais = async () => {
    try {
      const response = await authService.getAnimais();
      setAnimais(response);
    } catch (error) {
      setError('Erro ao carregar animais');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await authService.updateAnimal(editingId, formData);
      } else {
        await authService.createAnimal(formData);
      }
      fetchAnimais();
      resetForm();
    } catch (error) {
      setError('Erro ao salvar animal');
    }
  };

  const handleEdit = (animal) => {
    setFormData(animal);
    setIsEditing(true);
    setEditingId(animal.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este animal?')) {
      try {
        await authService.deleteAnimal(id);
        fetchAnimais();
      } catch (error) {
        setError('Erro ao excluir animal');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      especie: 'cachorro',
      porte: 'medio',
      sexo: 'macho',
      descricao: '',
      imagemUrl: '',
      vacinado: false,
      castrado: false
    });
    setIsEditing(false);
    setEditingId(null);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login de Administrador</h2>
            {adminLoginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
                {adminLoginError}
              </div>
            )}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={adminLogin.email}
                  onChange={e => setAdminLogin({ ...adminLogin, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <input
                  type="password"
                  value={adminLogin.senha}
                  onChange={e => setAdminLogin({ ...adminLogin, senha: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                disabled={adminLoading}
              >
                {adminLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Editar Animal' : 'Adicionar Novo Animal'}
          </h2>
          
          {!isAdmin && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              Apenas administradores podem adicionar, editar ou excluir animais.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={!isAdmin}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Espécie</label>
                <select
                  value={formData.especie}
                  onChange={(e) => setFormData({...formData, especie: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={!isAdmin}
                >
                  <option value="cachorro">Cachorro</option>
                  <option value="gato">Gato</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Porte</label>
                <select
                  value={formData.porte}
                  onChange={(e) => setFormData({...formData, porte: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={!isAdmin}
                >
                  <option value="pequeno">Pequeno</option>
                  <option value="medio">Médio</option>
                  <option value="grande">Grande</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sexo</label>
                <select
                  value={formData.sexo}
                  onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={!isAdmin}
                >
                  <option value="macho">Macho</option>
                  <option value="femea">Fêmea</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                  required
                  disabled={!isAdmin}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">URL da Imagem</label>
                <input
                  type="url"
                  value={formData.imagemUrl}
                  onChange={(e) => setFormData({...formData, imagemUrl: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={!isAdmin}
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.vacinado}
                    onChange={(e) => setFormData({...formData, vacinado: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={!isAdmin}
                  />
                  <span className="ml-2 text-sm text-gray-700">Vacinado</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.castrado}
                    onChange={(e) => setFormData({...formData, castrado: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={!isAdmin}
                  />
                  <span className="ml-2 text-sm text-gray-700">Castrado</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={!isAdmin}
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!isAdmin}
              >
                {isEditing ? 'Salvar Alterações' : 'Adicionar Animal'}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Animais */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Animais Cadastrados</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espécie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porte</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {animais.map((animal) => (
                  <tr key={animal.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={animal.imagemUrl}
                            alt={animal.nome}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{animal.nome}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {animal.especie}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {animal.porte}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {animal.sexo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {animal.vacinado && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Vacinado
                          </span>
                        )}
                        {animal.castrado && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Castrado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(animal)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        disabled={!isAdmin}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(animal.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={!isAdmin}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 