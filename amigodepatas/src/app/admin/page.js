'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/api';

export default function AdminPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
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
    castrado: false,
    adotado: false,
    lar_temporario: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    fetchAnimais();
  }, [isAdmin, router]);

  const fetchAnimais = async () => {
    try {
      const response = await authService.getAnimais();
      setAnimais(response);
    } catch {
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
    } catch {
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
      } catch {
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
      castrado: false,
      adotado: false,
      lar_temporario: false,
    });
    setIsEditing(false);
    setEditingId(null);
  };

  if (!isAdmin) {
    return null;
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
        <main className="flex-grow bg-gray-50 py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-center text-black">
                {isEditing ? 'Editar Animal' : 'Adicionar Novo Animal'}
              </h2>

              {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Nome</label>
                    <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Espécie</label>
                    <select
                        value={formData.especie}
                        onChange={(e) => setFormData({ ...formData, especie: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition"
                    >
                      <option value="cachorro">Cachorro</option>
                      <option value="gato">Gato</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Porte</label>
                    <select
                        value={formData.porte}
                        onChange={(e) => setFormData({ ...formData, porte: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition"
                    >
                      <option value="pequeno">Pequeno</option>
                      <option value="medio">Médio</option>
                      <option value="grande">Grande</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Sexo</label>
                    <select
                        value={formData.sexo}
                        onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition"
                    >
                      <option value="macho">Macho</option>
                      <option value="femea">Fêmea</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Descrição</label>
                    <textarea
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        rows="3"
                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">URL da Imagem</label>
                    <input
                        type="url"
                        value={formData.imagemUrl}
                        onChange={(e) => setFormData({ ...formData, imagemUrl: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition"
                    />
                  </div>
                  <div className="flex gap-6 items-center flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                          type="checkbox"
                          checked={formData.vacinado}
                          onChange={(e) => setFormData({ ...formData, vacinado: e.target.checked })}
                          className="h-6 w-6 rounded border-gray-300 text-pink-500 focus:ring-pink-400"
                      />
                      <span className="text-sm text-gray-700">Vacinado</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                          type="checkbox"
                          checked={formData.castrado}
                          onChange={(e) => setFormData({ ...formData, castrado: e.target.checked })}
                          className="h-6 w-6 rounded border-gray-300 text-pink-500 focus:ring-pink-400"
                      />
                      <span className="text-sm text-gray-700">Castrado</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                          type="checkbox"
                          checked={formData.adotado}
                          onChange={(e) => setFormData({ ...formData, adotado: e.target.checked })}
                          className="h-6 w-6 rounded border-gray-300 text-green-500 focus:ring-green-400"
                      />
                      <span className="text-sm text-gray-700">Adotado</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                          type="checkbox"
                          checked={formData.lar_temporario}
                          onChange={(e) => setFormData({ ...formData, lar_temporario: e.target.checked })}
                          className="h-6 w-6 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                      />
                      <span className="text-sm text-gray-700">Lar Temporário</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  {isEditing && (
                      <button
                          type="button"
                          onClick={resetForm}
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
                      >
                        Cancelar
                      </button>
                  )}
                  <button
                      type="submit"
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-semibold shadow"
                  >
                    {isEditing ? 'Salvar Alterações' : 'Adicionar Animal'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold mb-4">Lista de Animais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {animais.map((animal) => (
                    <div key={animal.id} className="border border-gray-200 rounded-2xl p-4 shadow hover:shadow-lg transition bg-gray-50 flex flex-col">
                      {animal.imagemUrl && (
                          <img
                              src={animal.imagemUrl}
                              alt={animal.nome}
                              className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-200"
                          />
                      )}
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{animal.nome}</h3>
                      <p className="text-gray-600 mb-2 line-clamp-2">{animal.descricao}</p>
                      <div className="mt-auto text-sm text-gray-500 space-y-1">
                        <p>Espécie: <span className="font-medium text-gray-700">{animal.especie}</span></p>
                        <p>Porte: <span className="font-medium text-gray-700">{animal.porte}</span></p>
                        <p>Sexo: <span className="font-medium text-gray-700">{animal.sexo}</span></p>
                        <p>Vacinado: <span className="font-medium text-gray-700">{animal.vacinado ? 'Sim' : 'Não'}</span></p>
                        <p>Castrado: <span className="font-medium text-gray-700">{animal.castrado ? 'Sim' : 'Não'}</span></p>
                        <p>Adotado: <span className="font-medium text-gray-700">{animal.adotado ? 'Sim' : 'Não'}</span></p>
                        <p>Lar Temporário: <span className="font-medium text-gray-700">{animal.lar_temporario ? 'Sim' : 'Não'}</span></p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => handleEdit(animal)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition"
                        >
                          Editar
                        </button>
                        <button
                            onClick={() => handleDelete(animal.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
}