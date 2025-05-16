"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="text-[22px] font-bold text-gray-800">Amigo de Patas</div>

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

      <div className="flex gap-2">
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
      </div>
    </header>
  );
}
