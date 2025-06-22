'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/api';
import { toast } from 'react-toastify';

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

    if (/\d/.test(formData.nome)) {
      toast.error('O nome não pode conter números.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Digite um email válido.');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não coincidem.');
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

      toast.success('Conta criada com sucesso!');
      await login(formData.email, formData.senha);
    } catch (error) {
      try {
        const text = await error.response.text();
        if (text.toLowerCase().includes('email')) {
          toast.error(text);
        } else {
          toast.error(text || 'Erro ao criar conta.');
        }
      } catch {
        toast.error('Este e-mail já está sendo usado por outro Usuário, tente outro e-mail.');
      }
    } finally {
      setLoading(false);
    }
  };

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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full border border-pink-100 rounded-2xl p-10 shadow-xl bg-white/80 backdrop-blur-lg">
            <div className="mb-6">
              <h2 className="text-center text-3xl font-extrabold text-pink-600 mb-1">
                Crie sua conta
              </h2>
              <p className="mt-1 text-center text-base text-gray-600">
                Ou{' '}
                <Link href="/login" className="font-semibold text-blue-600 hover:underline">
                  entre com sua conta existente
                </Link>
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={handleChange}
                  autoComplete="off"
              />

              <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
              />

              <input
                  id="senha"
                  name="senha"
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={handleChange}
                  autoComplete="off"
              />

              <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  placeholder="Confirmar senha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  autoComplete="off"
              />

              <input
                  id="endereco"
                  name="endereco"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  placeholder="Endereço"
                  value={formData.endereco}
                  onChange={handleChange}
                  autoComplete="off"
              />

              <input
                  id="telefone"
                  name="telefone"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="Telefone"
                  value={formData.telefone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setFormData(prev => ({ ...prev, telefone: formatted }));
                  }}
                  autoComplete="off"
                  maxLength={15}
              />

              <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 text-base font-bold rounded-lg text-white bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 transition disabled:opacity-60 shadow"
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
