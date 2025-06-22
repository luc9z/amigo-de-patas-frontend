'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/api';
import { toast } from 'react-toastify';

export default function AdminPage() {
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

  // Candidaturas
  const [candidaturas, setCandidaturas] = useState([]);
  const [candidaturasLoading, setCandidaturasLoading] = useState(false);

  const fetchCandidaturas = async () => {
    setCandidaturasLoading(true);
    try {
      const data = await authService.getCandidaturas();
      setCandidaturas(data); // <-- Este set precisa realmente atualizar a lista!
    } catch {
      toast.error("Erro ao buscar candidaturas");
    } finally {
      setCandidaturasLoading(false);
    }
  };


  useEffect(() => {
    if (currentTab === "candidaturas") fetchCandidaturas();
  }, [currentTab]);

  const [banners, setBanners] = useState(["", "", ""]);
  const [bannerMsg, setBannerMsg] = useState("");
  const [destaqueIds, setDestaqueIds] = useState([]);
  const [destaqueMsg, setDestaqueMsg] = useState("");
  const [cachorrosDisponiveis, setCachorrosDisponiveis] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchAnimais();
    fetchCachorrosDisponiveis();
  }, [isAdmin]);

  useEffect(() => {
    if (currentTab === 'customizar') {
      fetchBanners();
      fetchDestaques();
      setCachorrosDisponiveis(animais.filter(a => a.especie === 'cachorro' && !a.adotado));
    }
  }, [currentTab, animais]);

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
      toast.error('Erro ao carregar animais');
    } finally {
      setLoading(false);
    }
  };

  const fetchCachorrosDisponiveis = async () => {
    try {
      const response = await authService.getAnimais();
      const apenasCachorros = response.filter((a) => a.especie === 'cachorro' && !a.adotado);
      setCachorrosDisponiveis(apenasCachorros);
    } catch {
      toast.error('Erro ao carregar cachorros disponíveis');
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await authService.getBanners();
      setBanners(res.length ? res : ["", "", ""]);
    } catch {
      setBanners(["", "", ""]);
    }
  };
  const handleBannerChange = (idx, value) => {
    setBanners(banners.map((b, i) => (i === idx ? value : b)));
  };
  const addBanner = () => {
    if (banners.length < 3) setBanners([...banners, ""]);
  };
  const removeBanner = (idx) => {
    if (banners.length > 1) setBanners(banners.filter((_, i) => i !== idx));
  };
  const saveBanners = async () => {
    try {
      await authService.saveBanners(banners.filter(Boolean));
      toast.success("Banners salvos com sucesso!");
    } catch {
      toast.error("Erro ao salvar banners.");
    }
  };

  const fetchDestaques = async () => {
    try {
      const res = await authService.getDestaques();
      setDestaqueIds(res || []);
    } catch {
      setDestaqueIds([]);
    }
  };
  const toggleDestaque = (id) => {
    setDestaqueIds((prev) =>
        prev.includes(id)
            ? prev.filter((d) => d !== id)
            : prev.length < 10
                ? [...prev, id]
                : prev
    );
  };
  const saveDestaques = async () => {
    try {
      await authService.saveDestaques(destaqueIds);
      toast.success("Destaques salvos com sucesso!");
    } catch {
      toast.error("Erro ao salvar destaques.");
    }
  };

  const toBackend = (animal) => ({
    ...animal,
    lar_temporario: animal.larTemporario,
  });

  const handleFieldChange = (id, field, value) => {
    setAnimais((prev) =>
        prev.map((animal) => {
          if (animal.id !== id) return animal;
          if (!animal.editando) return animal;
          return { ...animal, [`_edit_${field}`]: value };
        })
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
    const animalEditado = { ...animal };
    Object.keys(animal).forEach((key) => {
      if (key.startsWith('_edit_')) {
        const realKey = key.replace('_edit_', '');
        animalEditado[realKey] = animal[key];
        delete animalEditado[key];
      }
    });
    try {
      await authService.updateAnimal(id, toBackend(animalEditado));
      setAnimais((prev) =>
          prev.map((a) =>
              a.id === id ? { ...animalEditado, editando: false } : a
          )
      );
      toast.success('Alterações salvas!');
    } catch {
      toast.error('Erro ao salvar alterações');
    }
  };

  // Modal para confirmação de exclusão
  const [confirmModal, setConfirmModal] = useState({ open: false, animalId: null });

  const openConfirmModal = (id) => setConfirmModal({ open: true, animalId: id });
  const closeConfirmModal = () => setConfirmModal({ open: false, animalId: null });

  const handleDelete = async (id) => {
    closeConfirmModal();
    try {
      await authService.deleteAnimal(id);
      try {
        const response = await authService.getAnimais();
        const formatado = response.map((a) => ({
          ...a,
          larTemporario: a.lar_temporario ?? false,
          editando: false,
        }));
        setAnimais(formatado);
      } catch {
        setAnimais((prev) => prev.filter((a) => a.id !== id));
      }
      toast.success('Animal removido com sucesso!');
    } catch (e) {
      toast.error('Erro ao excluir animal');
    }
  };

  const discardCandidatura = async (id) => {
    if (window.confirm('Tem certeza que deseja descartar esta candidatura?')) {
      try {
        await authService.deleteCandidatura(id);
        setCandidaturas((prev) => prev.filter((c) => c.id !== id)); // <-- Atualize o state direto
      } catch (e) {
        toast.error('Erro ao descartar candidatura.');
        console.error('Erro ao descartar candidatura:', e);
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
      toast.success('Animal cadastrado com sucesso!');
    } catch {
      toast.error('Erro ao cadastrar animal');
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <Header />
        {/* Modal de confirmação */}
        {confirmModal.open && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-lg border border-pink-100">
                <div className="text-pink-700 text-xl font-bold mb-3">Excluir animal?</div>
                <p className="mb-6 text-gray-700">Tem certeza que deseja excluir este animal? Esta ação não pode ser desfeita.</p>
                <div className="flex gap-4 justify-center">
                  <button
                      className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                      onClick={closeConfirmModal}
                  >Cancelar</button>
                  <button
                      className="bg-pink-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-pink-700 transition"
                      onClick={() => handleDelete(confirmModal.animalId)}
                  >Excluir</button>
                </div>
              </div>
            </div>
        )}

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
                <button
                    className={`text-left px-4 py-2 rounded-xl font-semibold transition border border-transparent hover:bg-pink-50 ${currentTab === 'customizar' ? 'bg-pink-100 text-pink-700 border-pink-300' : 'text-gray-700'}`}
                    onClick={() => setCurrentTab('customizar')}
                >
                  Customizar Site
                </button>
              </nav>
            </aside>
            <div className="flex-1">
              {currentTab === 'animais' && (
                  <>
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

                    <div className="bg-white/80 border border-pink-100 rounded-2xl shadow-lg px-8 py-5 mb-8 flex flex-wrap gap-4 justify-center items-center transition-all">
                      <div className="relative flex-1 min-w-[220px] max-w-xs">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="8" cy="8" r="7" /><path d="M17 17l-3.5-3.5" /></svg>
    </span>
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
                            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 bg-white text-gray-700 transition placeholder:text-gray-400 shadow-sm"
                            value={filters.nome}
                            onChange={e => setFilters({ ...filters, nome: e.target.value })}
                        />
                      </div>

                      <select
                          className="flex-1 min-w-[180px] max-w-xs px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white text-gray-700 transition shadow-sm"
                          value={filters.especie}
                          onChange={e => setFilters({ ...filters, especie: e.target.value })}
                      >
                        <option value="">Todas as espécies</option>
                        <option value="cachorro">Cachorro</option>
                        <option value="gato">Gato</option>
                      </select>

                      <select
                          className="flex-1 min-w-[140px] max-w-xs px-4 py-2 rounded-lg border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 bg-white text-gray-700 transition shadow-sm"
                          value={filters.adotado}
                          onChange={e => setFilters({ ...filters, adotado: e.target.value })}
                      >
                        <option value="">Todos</option>
                        <option value="sim">Adotados</option>
                        <option value="nao">Não Adotados</option>
                      </select>

                      <select
                          className="flex-1 min-w-[140px] max-w-xs px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white text-gray-700 transition shadow-sm"
                          value={filters.larTemporario}
                          onChange={e => setFilters({ ...filters, larTemporario: e.target.value })}
                      >
                        <option value="">Todos</option>
                        <option value="sim">Lar Temporário</option>
                        <option value="nao">Sem Lar Temporário</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {animaisFiltrados.map((animal) => {
                        const isEditing = animal.editando;
                        return (
                            <div
                                key={animal.id}
                                className={`relative group border border-gray-200 rounded-2xl p-4 shadow bg-white flex flex-col transition-all duration-300 ease-in-out hover:border-pink-400 hover:shadow-lg cursor-pointer`}
                                onMouseEnter={() => {
                                  if (!animal.editando) toggleEdit(animal.id);
                                }}
                                onMouseLeave={() => {
                                  if (animal.editando) toggleEdit(animal.id);
                                }}
                                style={animal.editando ? { cursor: 'default' } : { cursor: 'pointer' }}
                            >
                              {animal.imagemUrl && (
                                  <img src={animal.imagemUrl} alt={animal.nome} className="w-full h-48 object-cover rounded-xl mb-4" />
                              )}
                              {animal.editando ? (
                                  <>
                                    <input
                                        className="mb-2 px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-0 bg-white text-gray-800 transition-all duration-300 ease-in-out outline-none shadow-none"
                                        value={animal._edit_nome ?? animal.nome}
                                        onChange={(e) => handleFieldChange(animal.id, 'nome', e.target.value)}
                                        placeholder="Nome"
                                        tabIndex={0}
                                    />
                                    <textarea
                                        className="mb-2 px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-0 bg-white text-gray-800 transition-all duration-300 ease-in-out outline-none shadow-none"
                                        rows={2}
                                        value={animal._edit_descricao ?? animal.descricao}
                                        onChange={(e) => handleFieldChange(animal.id, 'descricao', e.target.value)}
                                        placeholder="Descrição"
                                        tabIndex={0}
                                    />
                                    <select
                                        className="mb-2 px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-0 bg-white text-gray-800 transition-all duration-300 ease-in-out outline-none shadow-none"
                                        value={animal._edit_especie ?? animal.especie}
                                        onChange={(e) => handleFieldChange(animal.id, 'especie', e.target.value)}
                                        tabIndex={0}
                                    >
                                      <option value="cachorro">Cachorro</option>
                                      <option value="gato">Gato</option>
                                    </select>
                                    <select
                                        className="mb-2 px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-0 bg-white text-gray-800 transition-all duration-300 ease-in-out outline-none shadow-none"
                                        value={animal._edit_porte ?? animal.porte}
                                        onChange={(e) => handleFieldChange(animal.id, 'porte', e.target.value)}
                                        tabIndex={0}
                                    >
                                      <option value="pequeno">Pequeno</option>
                                      <option value="medio">Médio</option>
                                      <option value="grande">Grande</option>
                                    </select>
                                    <select
                                        className="mb-2 px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-0 bg-white text-gray-800 transition-all duration-300 ease-in-out outline-none shadow-none"
                                        value={animal._edit_sexo ?? animal.sexo}
                                        onChange={(e) => handleFieldChange(animal.id, 'sexo', e.target.value)}
                                        tabIndex={0}
                                    >
                                      <option value="macho">Macho</option>
                                      <option value="femea">Fêmea</option>
                                    </select>
                                    <div className="flex flex-wrap gap-4 text-gray-700 mb-10">
                                      <label className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5" checked={animal._edit_vacinado !== undefined ? animal._edit_vacinado : animal.vacinado} onChange={(e) => handleFieldChange(animal.id, 'vacinado', e.target.checked)} tabIndex={0} /> Vacinado</label>
                                      <label className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5" checked={animal._edit_castrado !== undefined ? animal._edit_castrado : animal.castrado} onChange={(e) => handleFieldChange(animal.id, 'castrado', e.target.checked)} tabIndex={0} /> Castrado</label>
                                      <label className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5" checked={animal._edit_adotado !== undefined ? animal._edit_adotado : animal.adotado} onChange={(e) => handleFieldChange(animal.id, 'adotado', e.target.checked)} tabIndex={0} /> Adotado</label>
                                      <label className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5" checked={animal._edit_larTemporario !== undefined ? animal._edit_larTemporario : animal.larTemporario} onChange={(e) => handleFieldChange(animal.id, 'larTemporario', e.target.checked)} tabIndex={0} /> Lar Temporário</label>
                                    </div>
                                    <button
                                        onClick={() => openConfirmModal(animal.id)}
                                        className="absolute bottom-4 right-4 p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-300 ease-in-out shadow-sm"
                                        title="Excluir"
                                        tabIndex={0}
                                        type="button"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
                                      </svg>
                                    </button>
                                    <button
                                        onClick={() => handleSave(animal.id)}
                                        className="absolute left-1/2 -translate-x-1/2 bottom-4 px-5 py-2 bg-pink-500 text-white font-medium rounded-xl shadow hover:bg-pink-600 transition-all duration-300 ease-in-out z-20"
                                        style={{ minWidth: '120px', maxWidth: '70%' }}
                                        tabIndex={0}
                                        type="button"
                                    >
                                      Salvar
                                    </button>
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
                                  </>
                              )}
                            </div>
                        );
                      })}
                    </div>
                  </>
              )}

              {currentTab === 'candidaturas' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-pink-600 text-center">Candidaturas</h2>
                    {candidaturasLoading ? (
                        <div>Carregando candidaturas...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {candidaturas.length === 0 && <div className="text-gray-600 col-span-3">Nenhuma candidatura encontrada.</div>}
                          {candidaturas.map((c) => (
                              <div key={c.id} className="relative bg-white border border-pink-100 rounded-2xl p-6 shadow flex flex-col gap-2 transition hover:shadow-lg">
                                <button
                                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-pink-50 hover:bg-pink-200 text-pink-500 hover:text-pink-700 transition shadow-sm"
                                    onClick={() => discardCandidatura(c.id)}
                                    title="Descartar candidatura"
                                    type="button"
                                >
                                  <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
                                    <path d="M7 7l8 8M15 7l-8 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                                  </svg>
                                </button>
                                <div className="text-pink-600 font-bold text-xl mb-1">{c.animal.nome}</div>
                                <div className="text-gray-700 mb-1">Tipo: <span className="font-medium">{c.type}</span></div>
                                <div className="text-gray-700">Usuário: <span className="font-medium">{c.userName}</span></div>
                                <div className="text-gray-500 text-sm">E-mail: {c.user?.email}</div>
                                <div className="text-gray-500 text-sm">Telefone: {c.phone}</div>
                                <div className="text-gray-700 text-sm mt-1">
                                  Status:{' '}
                                  <span className={
                                    c.status === "PENDENTE" ? "text-yellow-600" :
                                        c.status === "ACEITO" ? "text-green-600" : "text-red-600"
                                  }>
                                  {c.status}
                                </span>
                                </div>
                                {c.status === "PENDENTE" && (
                                    <div className="flex gap-2 mt-2">
                                      <button
                                          onClick={async () => { await authService.approveCandidatura(c.id); fetchCandidaturas(); }}
                                          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                                      >Aceitar</button>
                                      <button
                                          onClick={async () => { await authService.rejectCandidatura(c.id); fetchCandidaturas(); }}
                                          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                                      >Negar</button>
                                    </div>
                                )}
                                {c.status === "ACEITO" && (
                                    <a
                                        href={`https://wa.me/55${(c.phone || '').replace(/\D/g, "")}?text=Olá, ${c.userName}! Sua candidatura foi aprovada para adoção de ${c.animal.nome}.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-green-500 text-white px-4 py-2 rounded-xl mt-3 font-semibold hover:bg-green-600 transition"
                                    >Conversar no WhatsApp</a>
                                )}
                              </div>

                          ))}
                        </div>
                    )}
                  </div>
              )}

              {currentTab === 'customizar' && (
                  <div className="space-y-12">
                    <section className="bg-white border border-gray-200 rounded-2xl shadow p-6 mb-10">
                      <h2 className="text-xl font-bold mb-4 text-pink-600">Banners do Carrossel</h2>
                      <p className="mb-4 text-gray-600">Adicione até 3 URLs de imagens para o carrossel da página inicial.</p>
                      <div className="flex flex-col gap-4 max-w-xl">
                        {banners.map((url, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <input
                                  type="url"
                                  className="border px-3 py-2 rounded w-full"
                                  placeholder={`URL do banner #${idx + 1}`}
                                  value={url}
                                  onChange={e => handleBannerChange(idx, e.target.value)}
                              />
                              <button
                                  className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                                  onClick={() => removeBanner(idx)}
                                  disabled={banners.length === 1}
                              >Remover</button>
                            </div>
                        ))}
                        {banners.length < 3 && (
                            <button
                                className="mt-2 bg-blue-100 text-blue-700 px-4 py-1 rounded hover:bg-blue-200"
                                onClick={addBanner}
                            >Adicionar Banner</button>
                        )}
                      </div>
                      <button
                          className="mt-6 bg-pink-600 text-white px-6 py-2 rounded-xl hover:bg-pink-700 transition font-semibold"
                          onClick={saveBanners}
                      >Salvar</button>
                    </section>

                    <section className="bg-white border border-gray-200 rounded-2xl shadow p-6">
                      <h2 className="text-xl font-bold mb-4 text-pink-600">Cachorros em Destaque na Home</h2>
                      <p className="mb-4 text-gray-600">Selecione até 10 cachorros não adotados para aparecerem em destaque na home.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        {cachorrosDisponiveis.map((dog) => (
                            <label key={dog.id} className="flex items-center gap-3 border rounded-lg p-2 cursor-pointer hover:bg-pink-50">
                              <input
                                  type="checkbox"
                                  checked={destaqueIds.includes(dog.id)}
                                  onChange={() => toggleDestaque(dog.id)}
                                  disabled={!destaqueIds.includes(dog.id) && destaqueIds.length >= 10}
                              />
                              <img src={dog.imagemUrl || '/placeholder.jpg'} alt={dog.nome} className="w-14 h-14 object-cover rounded" />
                              <span className="font-medium text-gray-700">{dog.nome}</span>
                            </label>
                        ))}
                      </div>
                      <button
                          className="mt-2 bg-pink-600 text-white px-6 py-2 rounded-xl hover:bg-pink-700 transition font-semibold"
                          onClick={saveDestaques}
                      >Salvar</button>
                    </section>
                  </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
}
