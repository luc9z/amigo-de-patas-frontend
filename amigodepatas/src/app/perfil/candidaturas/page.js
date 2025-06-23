"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/services/api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function MinhasCandidaturasPage() {
    const { user, isAuthenticated } = useAuth();
    const [candidaturas, setCandidaturas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetch = async () => {
            try {
                const minhas = await authService.getMinhasCandidaturas();
                setCandidaturas(minhas);
            } catch {
                setCandidaturas([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [user]);

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-blue-50">
                <Header />
                <div className="flex-1 flex items-center justify-center text-gray-500">
                    Faça login para ver suas candidaturas.
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="bg-gradient-to-br from-pink-50 via-white to-blue-50 min-h-screen flex flex-col">
            <Header />
            <section className="max-w-3xl mx-auto w-full flex-1 px-4 py-12">
                <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center">Minhas Candidaturas</h1>
                {loading ? (
                    <div className="text-center text-gray-600">Carregando...</div>
                ) : candidaturas.length === 0 ? (
                    <div className="text-gray-500 text-center">Você ainda não possui candidaturas.</div>
                ) : (
                    <ul className="space-y-6">
                        {candidaturas.map((c) => (
                            <li
                                key={c.id}
                                className="border-2 border-pink-100 rounded-2xl p-6 flex flex-col gap-2 bg-white shadow-lg transition hover:shadow-xl"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                                    <div>
                                        <div className="font-semibold text-lg text-pink-600">{c.animal?.nome || "-"}</div>
                                        <div className="text-sm text-gray-500 capitalize">
                                            Tipo:{" "}
                                            {c.type === "ADOCAO"
                                                ? "Adoção"
                                                : c.type === "LAR_TEMPORARIO"
                                                    ? "Lar Temporário"
                                                    : c.type}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            Data:{" "}
                                            {c.applicationDate
                                                ? new Date(c.applicationDate).toLocaleDateString("pt-BR")
                                                : "-"}
                                        </div>
                                    </div>
                                    <div className="ml-auto">
                    <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold
                        ${
                            c.status === "PENDENTE"
                                ? "bg-yellow-100 text-yellow-700"
                                : c.status === "ACEITO"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                        }`}
                    >
                      {c.status === "PENDENTE"
                          ? "Pendente"
                          : c.status === "ACEITO"
                              ? "Aprovada"
                              : c.status === "RECUSADO"
                                  ? "Recusada"
                                  : c.status}
                    </span>
                                    </div>
                                </div>
                                {c.message && (
                                    <div className="mt-1 text-gray-700 text-sm bg-pink-50 rounded-md px-4 py-2">
                                        <span className="font-semibold text-pink-600">Mensagem:</span>{" "}
                                        {c.message}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            <Footer />
        </main>
    );
}
