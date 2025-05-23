"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from 'react';

export default function Header() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <Link href="/" className="text-[22px] font-bold text-gray-800 hover:text-gray-600 transition">
        Amigo de Patas
      </Link>

      <nav className="flex gap-6">
        <a href="#" className="text-gray-600 hover:text-gray-800 transition">
          Quem Somos
        </a>
        <a href="#" className="text-gray-600 hover:text-gray-800 transition">
          Quero Adotar
        </a>
        <a href="#" className="text-gray-600 hover:text-gray-800 transition">
          Contato
        </a>
      </nav>

      <div className="flex gap-2 items-center">
        {!isAuthenticated ? (
          <>
            <Link href="/login">
              <button className="border border-gray-500 text-gray-700 rounded px-3 py-1 hover:bg-gray-100 transition">
                Entrar
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-pink-200 text-gray-800 font-medium rounded px-3 py-1 hover:bg-pink-300 transition">
                Cadastrar-se
              </button>
            </Link>
          </>
        ) : (
          <div className="flex gap-4 items-center">
            {isAdmin && (
              <Link href="/admin">
                <button className="bg-purple-100 text-purple-700 font-medium rounded px-3 py-1 hover:bg-purple-200 transition">
                  Área Admin
                </button>
              </Link>
            )}
            <Link href="/perfil" className="hover:opacity-80 transition">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                {user?.foto ? (
                  <Image
                    src={user.foto}
                    alt="Foto de perfil"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl text-gray-500">
                      {user?.nome?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-100 text-red-700 font-medium rounded px-3 py-1 hover:bg-red-200 transition"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
