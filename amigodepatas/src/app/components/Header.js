"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function Header() {
    const { isAuthenticated, user, logout, isAdmin } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-pink-100 px-8 py-5 flex items-center justify-between transition">
            <Link href="/" className="flex items-center group">
                <Image
                    src="/banners/logo.png"
                    alt="Amigo de Patas"
                    width={72}
                    height={72}
                    className="rounded-2xl transition group-hover:scale-105"
                    priority
                />
            </Link>

            <nav className="hidden md:flex gap-8 items-center font-semibold text-lg">
                <Link href="/quem-somos" className="text-gray-700 hover:text-pink-600 transition">Quem Somos</Link>
                <Link href="/animais" className="text-gray-700 hover:text-pink-600 transition">Quero Adotar</Link>
                <Link href="/contato" className="text-gray-700 hover:text-pink-600 transition">Contato</Link>
            </nav>

            <div className="flex gap-3 items-center">
                {!isAuthenticated ? (
                    <>
                        <Link href="/login">
                            <button className="border border-blue-400 text-blue-700 font-semibold rounded-lg px-4 py-1.5 text-base hover:bg-blue-50 transition">
                                Entrar
                            </button>
                        </Link>
                        <Link href="/register">
                            <button className="bg-pink-200 text-pink-800 font-bold rounded-lg px-4 py-1.5 text-base hover:bg-pink-300 transition">
                                Cadastrar-se
                            </button>
                        </Link>
                    </>
                ) : (
                    <div className="flex gap-3 items-center">
                        {isAdmin && (
                            <Link href="/admin">
                                <button className="bg-purple-100 text-purple-700 font-bold rounded-lg px-4 py-1.5 text-base hover:bg-purple-200 transition shadow">
                                    Área Admin
                                </button>
                            </Link>
                        )}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen((v) => !v)}
                                className="hover:ring-2 ring-pink-200 transition w-12 h-12 rounded-full border-2 border-gray-200 overflow-hidden focus:outline-none bg-white"
                                title={user?.nome || "Perfil"}
                            >
                                {user?.userImg ? (
                                    <Image src={user.userImg} alt="Foto de perfil" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-pink-700">
                                            {user?.nome?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white border border-pink-100 py-2 z-50 flex flex-col animate-fade-in font-medium">
                                    <div className="px-5 py-2 border-b border-gray-100 text-gray-700 flex items-center gap-2">
                                        {user?.userImg ? (
                                            <Image src={user.userImg} alt="Foto de perfil" width={32} height={32} className="rounded-full" />
                                        ) : (
                                            <span className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-lg font-bold text-pink-700">
                                                {user?.nome?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                        <span>{user?.nome}</span>
                                    </div>
                                    <Link
                                        href="/perfil"
                                        className="px-5 py-2 hover:bg-pink-50 text-gray-800 text-base text-left transition"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Meu Perfil
                                    </Link>
                                    <Link
                                        href="/perfil/candidaturas"
                                        className="px-5 py-2 hover:bg-pink-50 text-gray-800 text-base text-left transition"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Minhas Candidaturas
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="px-5 py-2 text-left text-red-600 hover:bg-red-50 text-base transition"
                                    >
                                        Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="md:hidden"></div>
        </header>
    );
}
