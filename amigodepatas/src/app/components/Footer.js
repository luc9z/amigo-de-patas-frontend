'use client';

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
      <footer className="bg-gradient-to-r from-pink-50 via-white to-blue-50 border-t border-pink-100 pt-14 pb-6 px-4 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center gap-12 pb-10">
          <div className="flex flex-col items-center gap-3 flex-1 min-w-[220px]">
            <div className="flex items-center gap-3 mb-2 justify-center">
              <Image src="/banners/logo.png" alt="Amigo de Patas" width={54} height={54} className="rounded-lg" />
              <span className="font-bold text-2xl sm:text-3xl text-pink-600">Amigo de Patas</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg max-w-[320px] mx-auto text-center">
              Conectando animais resgatados a lares cheios de amor.<br />
              <span className="italic text-pink-700 font-medium">“Adotar é um ato de carinho e esperança.”</span>
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1 min-w-[220px]">
            <h4 className="text-blue-700 font-bold mb-2 text-lg sm:text-xl">Navegação</h4>
            <ul className="space-y-2 text-base sm:text-lg font-medium">
              <li>
                <Link href="/" className="text-gray-700 hover:text-pink-600 transition">Início</Link>
              </li>
              <li>
                <Link href="/animais" className="text-gray-700 hover:text-pink-600 transition">Quero Adotar</Link>
              </li>
              <li>
                <Link href="/quem-somos" className="text-gray-700 hover:text-pink-600 transition">Quem Somos</Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-700 hover:text-pink-600 transition">Contato</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1 min-w-[220px]">
            <h4 className="text-blue-700 font-bold mb-2 text-lg sm:text-xl">Contato</h4>
            <ul className="text-base sm:text-lg text-gray-700 font-medium space-y-2 text-center">
              <li>
                <span className="font-semibold">E-mail:</span> amigodepatas@gmail.com
              </li>
              <li>
                <span className="font-semibold">Telefone:</span> (55) 99999-9999
              </li>
              <li>
                <span className="font-semibold">Endereço:</span> Santiago, RS - Brasil
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-pink-100 pt-5 text-center text-base sm:text-lg text-gray-500 font-semibold tracking-wide">
          © {new Date().getFullYear()} <span className="text-blue-700">Amigo de Patas</span> — Todos os direitos reservados. <span className="text-pink-600">♥</span>
        </div>
      </footer>
  );
}
