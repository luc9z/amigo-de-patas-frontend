'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Image from 'next/image';

export default function PerfilPage() {
  const { user, updateUser } = useAuth();
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    endereco: '',
    telefone: '',
    userImg: ''
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (field) => {
    setLoading(true);
    try {
      await updateUser({ [field]: formData[field] });
      setEditingField(null);
    } catch (err) {
      console.error('Erro ao salvar:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field, label) => {
    const isEditing = editingField === field;

    return (
        <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-full">
              <p className="text-sm text-gray-500">{label}:</p>
              {isEditing ? (
                  <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      disabled={loading}
                  />
              ) : (
                  <p className="mt-1 text-gray-800">{formData[field] || 'Não informado'}</p>
              )}
            </div>
            <div className="ml-2 mt-1">
              {isEditing ? (
                  <button
                      onClick={() => handleSave(field)}
                      className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      disabled={loading}
                      title="Salvar"
                  >
                    💾
                  </button>
              ) : (
                  <button
                      onClick={() => setEditingField(field)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Editar"
                  >
                    ✏️
                  </button>
              )}
            </div>
          </div>
        </div>
    );
  };

  return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow bg-gray-50 py-10 px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Meu Perfil</h1>

            {user ? (
                <div className="flex flex-col items-center gap-8">
                  {/* IMAGEM DO PERFIL */}
                  <div className="relative group flex flex-col items-center">
                    <div
                        className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 mb-2 relative"
                        title="Foto de perfil"
                    >
                      {formData.userImg ? (
                          <Image
                              src={formData.userImg}
                              alt="Foto de perfil"
                              fill
                              className="object-cover"
                          />
                      ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl text-gray-500">
                        {formData.nome?.charAt(0).toUpperCase() || "?"}
                      </span>
                          </div>
                      )}
                    </div>
                  </div>

                  {/* CAMPOS */}
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
