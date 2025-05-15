"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import authService from "@/services/api";

export default function PerfilPage() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("usuario");
    if (data && data !== "undefined") {
      try {
        setUsuario(JSON.parse(data));
      } catch (e) {
        console.error("Erro ao carregar usuário:", e);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Meu Perfil
        </h1>

        {usuario ? (
          <div className="flex flex-col items-center gap-5 text-center">
            <Image
              src={usuario.foto || "/user-icon.png"}
              alt="Foto do usuário"
              width={120}
              height={120}
              className="rounded-full object-cover border border-gray-300 shadow"
            />

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {usuario.nome}
              </h2>
              <p className="text-gray-500">{usuario.email}</p>
            </div>

            <button
              onClick={() => {
                authService.logout();
                window.location.href = "/";
              }}
              className="mt-4 bg-red-100 text-red-700 font-medium px-4 py-2 rounded-md hover:bg-red-200 transition"
            >
              Sair da conta
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">
            Nenhum usuário encontrado.
          </p>
        )}
      </div>
    </main>
  );
}
