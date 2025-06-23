'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Image from 'next/image';

export default function PerfilPage() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    endereco: '',
    telefone: '',
    userImg: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        endereco: user.endereco || '',
        telefone: user.telefone || '',
        userImg: user.userImg || ''
      });
    }
  }, [user]);

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      const formatted = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, telefone: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleClearField = (field) => {
    setFormData(prev => ({ ...prev, [field]: '' }));
  };

  const handleSaveAll = async () => {
    if (formData.userImg && formData.userImg.length > 255) {
      alert("A URL da imagem é muito longa. Por favor, insira um link com no máximo 255 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const { email, ...dataToSend } = formData;
      await updateUser(dataToSend);
      setIsEditing(false);
    } catch (err) {
      console.error('Erro ao salvar:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field, label) => {
    const isEditingField = isEditing && field !== 'email';
    return (
        <div className="border border-pink-100 rounded-xl p-4 bg-white shadow flex items-start justify-between transition-all">
          <div className="w-full">
            <p className="text-xs font-medium text-gray-500">{label}:</p>
            {isEditingField ? (
                <input
                    type="text"
                    name={field}
                    placeholder={`Digite seu ${label.toLowerCase()}`}
                    value={formData[field]}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-100 placeholder:text-gray-400 bg-white text-gray-700 text-sm"
                    disabled={loading}
                />
            ) : (
                <p className="mt-1 text-gray-800 text-base">{formData[field] || <span className="text-gray-400">Não informado</span>}</p>
            )}
          </div>
          {isEditingField && (
              <button
                  onClick={() => handleClearField(field)}
                  className="ml-2 mt-6 text-red-400 hover:text-red-600 transition"
                  title={`Limpar ${label.toLowerCase()}`}
                  type="button"
              >
                🗑️
              </button>
          )}
        </div>
    );
  };

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <Header />
        <main className="flex-grow py-10 px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-pink-100 p-8">
            <h1 className="text-3xl font-bold text-pink-600 text-center mb-8">Meu Perfil</h1>

            {user ? (
                <div className="flex flex-col items-center gap-8">
                  <div className="relative flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-200 mb-2 bg-pink-50 shadow">
                      {formData.userImg ? (
                          <Image src={formData.userImg} alt="Foto de perfil" fill className="object-cover" />
                      ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-5xl text-gray-500">{formData.nome?.charAt(0).toUpperCase() || "?"}</span>
                          </div>
                      )}
                    </div>
                    {isEditing && (
                        <div className="mt-2 w-72">
                          <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                            <input
                                type="text"
                                name="userImg"
                                placeholder="URL da imagem"
                                value={formData.userImg}
                                onChange={handleChange}
                                className="px-4 py-2 border border-pink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 placeholder:text-gray-400 bg-white text-gray-700"
                                disabled={loading}
                            />
                            <button
                                onClick={() => handleClearField('userImg')}
                                className="text-red-400 hover:text-red-600 px-2 py-2 bg-pink-50 rounded-md transition"
                                title="Limpar URL"
                                type="button"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                    )}
                  </div>

                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {renderField('nome', 'Nome')}
                      {renderField('email', 'Email')}
                    </div>
                    <div className="space-y-4">
                      {renderField('endereco', 'Endereço')}
                      {renderField('telefone', 'Telefone')}
                    </div>
                  </div>

                  <div className="w-full flex justify-center mt-6">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-pink-600 text-white font-semibold px-8 py-2 rounded-xl shadow hover:bg-pink-700 transition text-lg"
                        >
                          Editar Dados
                        </button>
                    ) : (
                        <button
                            onClick={handleSaveAll}
                            disabled={loading}
                            className="bg-blue-500 text-white font-semibold px-8 py-2 rounded-xl shadow hover:bg-blue-600 transition text-lg"
                        >
                          {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    )}
                  </div>
                </div>
            ) : (
                <p className="text-center text-gray-500 italic">Nenhum usuário encontrado.</p>
            )}
          </div>
        </main>
        <Footer />
      </div>
  );
}
