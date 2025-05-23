"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";

export default function PerfilPage() {
  const { user, updateUser } = useAuth();
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (field) => {
    setLoading(true);
    setError('');

    try {
      await updateUser({ [field]: formData[field] });
      setEditingField(null);
    } catch (error) {
      setError('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('foto', file);

      const response = await fetch('/api/upload-foto', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erro ao fazer upload da foto');

      const data = await response.json();
      await updateUser({ ...user, foto: data.url });
    } catch (error) {
      setError('Erro ao fazer upload da foto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field, label) => {
    const isEditing = editingField === field;

    return (
      <div className="flex items-center gap-2 py-2">
        <div className="flex-grow">
          {isEditing ? (
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          ) : (
            <div className="px-3 py-2">
              <span className="text-sm text-gray-500">{label}:</span>
              <p className="text-gray-800">{user[field]}</p>
            </div>
          )}
        </div>
        {isEditing ? (
          <button
            onClick={() => handleSave(field)}
            className="p-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => setEditingField(field)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Meu Perfil
          </h1>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {user ? (
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div 
                  className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer"
                  onClick={handleFotoClick}
                >
                  {user.foto ? (
                    <Image
                      src={user.foto}
                      alt="Foto de perfil"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl text-gray-500">
                        {user.nome?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm">Alterar foto</span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFotoChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="w-full max-w-md space-y-2">
                {renderField('nome', 'Nome')}
                {renderField('email', 'Email')}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 italic">
              Nenhum usuário encontrado.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
} 