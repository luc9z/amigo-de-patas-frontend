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
  const [showForm, setShowForm] = useState(false);
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
    larTemporario: false,
  });

  const [filters, setFilters] = useState({ nome: '', especie: '', adotado: '', larTemporario: '' });
  const [currentTab, setCurrentTab] = useState('animais');

  const [candidaturas] = useState([
    {
      id: 1,
      animalNome: 'Rex',
      tipo: 'Adoção',
      usuario: { nome: 'João Silva', email: 'joao@email.com' }
    },
    {
      id: 2,
      animalNome: 'Mimi',
      tipo: 'Lar Temporário',
      usuario: { nome: 'Maria Souza', email: 'maria@email.com' }
    },
    {
      id: 3,
      animalNome: 'Thor',
      tipo: 'Adoção',
      usuario: { nome: 'Carlos Lima', email: 'carlos@email.com' }
    }
  ]);

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
      const formatado = response.map((a) => ({
        ...a,
        larTemporario: a.lar_temporario ?? false,
        editando: false,
      }));
      setAnimais(formatado);
    } catch {
      setError('Erro ao carregar animais');
    } finally {
      setLoading(false);
    }
  };

  const toBackend = (animal) => ({
    ...animal,
    lar_temporario: animal.larTemporario,
  });

  const handleFieldChange = (id, field, value) => {
    setAnimais((prev) =>
      prev.map((animal) =>
        animal.id === id ? { ...animal, [field]: value } : animal
      )
    );
  };

  const toggleEdit = (id) => {
    setAnimais((prev) =>
      prev.map((animal) =>
        animal.id === id ? { ...animal, editando: !animal.editando } : animal
      )
    );
  };

  const cancelEdit = () => fetchAnimais();

  const handleSave = async (id) => {
    const animal = animais.find((a) => a.id === id);
    try {
      await authService.updateAnimal(id, toBackend(animal));
      toggleEdit(id);
    } catch {
      setError('Erro ao salvar alterações');
    }
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

  const handleCreateAnimal = async () => {
    try {
      await authService.createAnimal(toBackend(formData));
      fetchAnimais();
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
        larTemporario: false,
      });
      setShowForm(false);
    } catch {
      setError('Erro ao cadastrar animal');
    }
  };

  const animaisFiltrados = animais.filter((a) => {
    const nomeCond = a.nome.toLowerCase().includes(filters.nome.toLowerCase());
    const especieCond = filters.especie ? a.especie === filters.especie : true;
    const adotadoCond = filters.adotado ? a.adotado === (filters.adotado === 'sim') : true;
    const larCond = filters.larTemporario ? a.larTemporario === (filters.larTemporario === 'sim') : true;
    return nomeCond && especieCond && adotadoCond && larCond;
  });

  if (!isAdmin) return null;
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-xl">Carregando...</div></div>;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow py-10 px-4">
        <div className="max-w-7xl mx-auto flex gap-8">
          <aside className="w-56 hidden md:block">
            <nav className="flex flex-col gap-2">
              <button
                className={`text-left px-4 py-2 rounded-xl font-semibold transition border border-transparent hover:bg-pink-50 ${currentTab === 'animais' ? 'bg-pink-100 text-pink-700 border-pink-300' : 'text-gray-700'}`}
                onClick={() => setCurrentTab('animais')}
              >
                Animais
              </button>
              <button
                className={`text-left px-4 py-2 rounded-xl font-semibold transition border border-transparent hover:bg-pink-50 ${currentTab === 'candidaturas' ? 'bg-pink-100 text-pink-700 border-pink-300' : 'text-gray-700'}`}
                onClick={() => setCurrentTab('candidaturas')}
              >
                Ver Candidaturas
              </button>
            </nav>
          </aside>
          <div className="flex-1">
            {currentTab === 'animais' && (
              <>
                {error && <div className="bg-red-100 text-red-800 px-4 py-2 mb-4 rounded">{error}</div>}

                <div className="text-center mb-6">
                  <button onClick={() => setShowForm(!showForm)} className="px-6 py-2 bg-pink-600 text-white rounded-xl shadow hover:bg-pink-700 transition font-semibold">
                    {showForm ? 'Fechar Cadastro' : 'Cadastrar Animal'}
                  </button>
                </div>

                {showForm && (
                  <div className="bg-white border border-gray-200 rounded-2xl shadow p-6 mb-10 max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700" />
                      <input type="url" placeholder="URL da Imagem" value={formData.imagemUrl} onChange={(e) => setFormData({ ...formData, imagemUrl: e.target.value })} className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700" />
                      <select value={formData.especie} onChange={(e) => setFormData({ ...formData, especie: e.target.value })} className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700">
                        <option value="cachorro">Cachorro</option>
                        <option value="gato">Gato</option>
                      </select>
                      <select value={formData.porte} onChange={(e) => setFormData({ ...formData, porte: e.target.value })} className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700">
                        <option value="pequeno">Pequeno</option>
                        <option value="medio">Médio</option>
                        <option value="grande">Grande</option>
                      </select>
                      <select value={formData.sexo} onChange={(e) => setFormData({ ...formData, sexo: e.target.value })} className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700">
                        <option value="macho">Macho</option>
                        <option value="femea">Fêmea</option>
                      </select>
                      <textarea placeholder="Descrição" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700 md:col-span-2" rows={3} />
                      <div className="flex gap-6 flex-wrap md:col-span-2 mt-2 text-gray-700">
                        <label className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5" checked={formData.vacinado} onChange={(e) => setFormData({ ...formData, vacinado: e.target.checked })} /> Vacinado</label>
                        <label className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5" checked={formData.castrado} onChange={(e) => setFormData({ ...formData, castrado: e.target.checked })} /> Castrado</label>
                        <label className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5" checked={formData.adotado} onChange={(e) => setFormData({ ...formData, adotado: e.target.checked })} /> Adotado</label>
                        <label className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5" checked={formData.larTemporario} onChange={(e) => setFormData({ ...formData, larTemporario: e.target.checked })} /> Lar Temporário</label>
                      </div>
                    </div>
                    <button onClick={handleCreateAnimal} className="mt-6 bg-pink-600 text-white px-6 py-2 rounded-xl hover:bg-pink-700 transition font-semibold">Salvar</button>
                  </div>
                )}

                <div className="bg-white border rounded-xl p-4 mb-8 flex flex-wrap gap-4 justify-center">
                  <input type="text" placeholder="Buscar por nome..." className="border px-3 py-2 rounded text-black" value={filters.nome} onChange={(e) => setFilters({ ...filters, nome: e.target.value })} />
                  <select className="border px-3 py-2 rounded text-black" value={filters.especie} onChange={(e) => setFilters({ ...filters, especie: e.target.value })}>
                    <option value="">Todas as espécies</option>
                    <option value="cachorro">Cachorro</option>
                    <option value="gato">Gato</option>
                  </select>
                  <select className="border px-3 py-2 rounded text-black" value={filters.adotado} onChange={(e) => setFilters({ ...filters, adotado: e.target.value })}>
                    <option value="">Todos</option>
                    <option value="sim">Adotados</option>
                    <option value="nao">Não Adotados</option>
                  </select>
                  <select className="border px-3 py-2 rounded text-black" value={filters.larTemporario} onChange={(e) => setFilters({ ...filters, larTemporario: e.target.value })}>
                    <option value="">Todos</option>
                    <option value="sim">Lar Temporário</option>
                    <option value="nao">Sem Lar Temporário</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {animaisFiltrados.map((animal) => (
                    <div key={animal.id} className="border border-gray-200 rounded-2xl p-4 shadow bg-white flex flex-col">
                      {animal.imagemUrl && (
                        <img src={animal.imagemUrl} alt={animal.nome} className="w-full h-48 object-cover rounded-xl mb-4" />
                      )}
                      {animal.editando ? (
                        <>
                          <input className="mb-2 border px-3 py-2 rounded text-gray-800" value={animal.nome} onChange={(e) => handleFieldChange(animal.id, 'nome', e.target.value)} />
                          <textarea className="mb-2 border px-3 py-2 rounded text-gray-800" rows={2} value={animal.descricao} onChange={(e) => handleFieldChange(animal.id, 'descricao', e.target.value)} />
                          <select className="mb-2 border px-3 py-2 rounded text-gray-800" value={animal.especie} onChange={(e) => handleFieldChange(animal.id, 'especie', e.target.value)}><option value="cachorro">Cachorro</option><option value="gato">Gato</option></select>
                          <select className="mb-2 border px-3 py-2 rounded text-gray-800" value={animal.porte} onChange={(e) => handleFieldChange(animal.id, 'porte', e.target.value)}><option value="pequeno">Pequeno</option><option value="medio">Médio</option><option value="grande">Grande</option></select>
                          <select className="mb-2 border px-3 py-2 rounded text-gray-800" value={animal.sexo} onChange={(e) => handleFieldChange(animal.id, 'sexo', e.target.value)}><option value="macho">Macho</option><option value="femea">Fêmea</option></select>
                          <div className="flex flex-wrap gap-4 text-gray-700 mb-2">
                            <label><input type="checkbox" className="w-5 h-5" checked={!!animal.vacinado} onChange={(e) => handleFieldChange(animal.id, 'vacinado', e.target.checked)} /> Vacinado</label>
                            <label><input type="checkbox" className="w-5 h-5" checked={!!animal.castrado} onChange={(e) => handleFieldChange(animal.id, 'castrado', e.target.checked)} /> Castrado</label>
                            <label><input type="checkbox" className="w-5 h-5" checked={!!animal.adotado} onChange={(e) => handleFieldChange(animal.id, 'adotado', e.target.checked)} /> Adotado</label>
                            <label><input type="checkbox" className="w-5 h-5" checked={!!animal.larTemporario} onChange={(e) => handleFieldChange(animal.id, 'larTemporario', e.target.checked)} /> Lar Temporário</label>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <button onClick={() => handleSave(animal.id)} className="bg-pink-600 text-white px-4 py-1 rounded-xl hover:bg-pink-700">Salvar</button>
                            <button onClick={cancelEdit} className="bg-gray-300 text-gray-800 px-4 py-1 rounded-xl hover:bg-gray-400">Cancelar</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-lg font-bold text-gray-800 mb-1">{animal.nome}</h3>
                          <p className="text-gray-600 mb-2 line-clamp-2">{animal.descricao}</p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>Espécie: {animal.especie}</p>
                            <p>Porte: {animal.porte}</p>
                            <p>Sexo: {animal.sexo}</p>
                            <p>Vacinado: {animal.vacinado ? 'Sim' : 'Não'}</p>
                            <p>Castrado: {animal.castrado ? 'Sim' : 'Não'}</p>
                            <p>Adotado: {animal.adotado ? 'Sim' : 'Não'}</p>
                            <p>Lar Temporário: {animal.larTemporario ? 'Sim' : 'Não'}</p>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <button onClick={() => toggleEdit(animal.id)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Editar</button>
                            <button onClick={() => handleDelete(animal.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Excluir</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            {currentTab === 'candidaturas' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-pink-600 text-center">Candidaturas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {candidaturas.map((c) => (
                    <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow flex flex-col gap-2">
                      <div className="text-pink-600 font-semibold text-lg mb-1">{c.animalNome}</div>
                      <div className="text-gray-700 mb-1">Tipo: <span className="font-medium">{c.tipo}</span></div>
                      <div className="text-gray-700">Usuário: <span className="font-medium">{c.usuario.nome}</span></div>
                      <div className="text-gray-500 text-sm">E-mail: {c.usuario.email}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}