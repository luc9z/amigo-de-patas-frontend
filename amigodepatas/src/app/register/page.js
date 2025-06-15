'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/api';

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    endereco: '',
    telefone: '',
  });

  const [error, setError] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorEmail('');

    if (/\d/.test(formData.nome)) {
      setError('O nome não pode conter números.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorEmail('Digite um email válido.');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        endereco: formData.endereco,
        telefone: formData.telefone,
      });

      await login(formData.email, formData.senha);
    } catch (error) {
      setError('');
      setErrorEmail('');

      try {
        const text = await error.response.text();

        if (text.toLowerCase().includes('email')) {
          setErrorEmail(text); // Mostra abaixo do campo de e-mail
        } else {
          setError(text || 'Erro ao criar conta.');
        }
      } catch {
        setError('Este e-mail já está sendo usado por outro Usuario, tente outro e-mail.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Função que formata o telefone
  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 border border-gray-300 rounded-xl p-8 shadow-md bg-white">
            <div>
              <h2 className="text-center text-3xl font-extrabold text-gray-900">
                Crie sua conta
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Ou{' '}
                <Link href="/login" className="font-medium text-pink-600 hover:text-pink-500">
                  entre com sua conta existente
                </Link>
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                  </div>
              )}

              <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-pink-500"
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={handleChange}
              />

              <div>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-pink-500"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => {
                      setErrorEmail('');
                      handleChange(e);
                    }}
                />
                {errorEmail && (
                    <p className="mt-1 text-sm text-red-600">{errorEmail}</p>
                )}
              </div>

              <input
                  id="senha"
                  name="senha"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-pink-500"
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={handleChange}
              />
              <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-pink-500"
                  placeholder="Confirmar senha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
              />
              <input
                  id="endereco"
                  name="endereco"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-pink-500"
                  placeholder="Endereço"
                  value={formData.endereco}
                  onChange={handleChange}
              />
              <input
                  id="telefone"
                  name="telefone"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-pink-500"
                  placeholder="Telefone"
                  value={formData.telefone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setFormData(prev => ({ ...prev, telefone: formatted }));
                  }}
              />

              <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-pink-400 disabled:opacity-50"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
  );
}
