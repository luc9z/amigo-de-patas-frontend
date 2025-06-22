'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.senha);
      toast.success('Login realizado com sucesso!');
      router.push('/perfil');
    } catch (err) {
      toast.error('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full border border-pink-100 rounded-2xl p-10 shadow-xl bg-white/80 backdrop-blur-lg">
            <div className="mb-6">
              <h2 className="text-center text-3xl font-extrabold text-pink-600">Entre na sua conta</h2>
              <p className="mt-1 text-center text-base text-gray-600">
                Ou{' '}
                <Link
                    href="/register"
                    className="font-semibold text-blue-600 hover:underline"
                >
                  crie uma nova conta
                </Link>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
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
              </div>
              <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 text-base font-bold rounded-lg text-white bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 transition disabled:opacity-60 shadow"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
  );
}
