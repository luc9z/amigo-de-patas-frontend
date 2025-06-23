'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authService } from '@/services/api';
import FilterPanel from '@/app/components/filterPanel';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AnimaisPage() {
    const [animais, setAnimais] = useState([]);
    const [allAnimais, setAllAnimais] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        especie: '',
        porte: '',
        sexo: '',
        vacinado: null,
        castrado: null,
        lar_temporario: null,
        adotado: null,
    });
    const searchParams = useSearchParams();

    useEffect(() => {
        const especie = searchParams.get('especie');
        if (especie) {
            setFilters((prev) => ({ ...prev, especie }));
        }
        fetchAnimais();
    }, []);

    useEffect(() => {
        if (allAnimais.length) {
            filterAnimais();
        }
    }, [filters, allAnimais]);

    function gerarSlugsUnicos(animais) {
        const contador = {};
        return animais.map((animal) => {
            const nomeBase = animal.nome.toLowerCase().replace(/\s+/g, "");
            contador[nomeBase] = (contador[nomeBase] || 0) + 1;
            const slug = `${nomeBase}${contador[nomeBase]}`;
            return { ...animal, slug, especie: animal.especie.toLowerCase() };
        });
    }

    const fetchAnimais = async () => {
        setLoading(true);
        try {
            const response = await authService.getAnimais();
            const animaisComSlug = gerarSlugsUnicos(response);
            const naoAdotados = animaisComSlug.filter(a => !a.adotado);
            setAnimais(naoAdotados);
            setAllAnimais(naoAdotados);
        } catch (error) {
            console.error('Erro ao carregar animais:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAnimais = () => {
        const filtered = allAnimais.filter(animal => {
            return (
                (filters.especie ? animal.especie === filters.especie : true) &&
                (filters.porte ? animal.porte === filters.porte : true) &&
                (filters.sexo ? animal.sexo === filters.sexo : true) &&
                (filters.vacinado !== null ? animal.vacinado === filters.vacinado : true) &&
                (filters.castrado !== null ? animal.castrado === filters.castrado : true) &&
                (filters.lar_temporario !== null ? animal.lar_temporario === filters.lar_temporario : true) &&
                (filters.adotado !== null ? animal.adotado === filters.adotado : true)
            );
        });
        setAnimais(filtered);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-blue-50">
            <Header />

            <main className="flex-grow py-10 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="text-pink-600 hover:underline font-medium">
                            Página Inicial
                        </Link>
                        <span className="mx-1 text-gray-400">/</span>
                        <span className="text-gray-700 font-semibold">Animais</span>
                    </div>

                    <h1 className="text-3xl font-bold mb-4 text-pink-700 text-center">Animais Disponíveis para Adoção</h1>

                    <div className="mb-10 flex justify-center">
                        <div className="w-full max-w-md">
                            <div className="bg-white/80 border border-pink-100 rounded-2xl shadow-lg px-8 py-6 flex flex-col gap-3">
                                <FilterPanel onFilterChange={handleFilterChange} />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center text-lg text-pink-700 font-semibold py-16">Carregando...</div>
                    ) : animais.length === 0 ? (
                        <div className="text-center text-gray-500 font-medium py-16">
                            Nenhum animal encontrado com os filtros selecionados.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {animais.map((animal) => (
                                <div
                                    key={animal.id}
                                    className="group border border-pink-100 rounded-2xl shadow bg-white flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-pink-400 hover:-translate-y-2"
                                    style={{ minWidth: 270, maxWidth: 340, margin: "0 auto" }}
                                >
                                    <div className="relative h-[210px] bg-gray-100">
                                        <img
                                            src={animal.imagemUrl || '/placeholder.jpg'}
                                            alt={animal.nome}
                                            className="w-full h-full object-cover rounded-t-2xl transition-all duration-300 group-hover:scale-105"
                                        />
                                        {animal.lar_temporario && (
                                            <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                                                🏠 Lar Temporário
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold mb-1 text-pink-700">{animal.nome}</h3>
                                        <p className="text-gray-700 mb-2">Espécie: <span className="font-semibold">{animal.especie}</span></p>
                                        <p className="text-gray-600 mb-2">Porte: <span className="font-semibold">{animal.porte}</span></p>
                                        <div className="flex justify-center gap-2 mb-3 flex-wrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${animal.vacinado ? "bg-green-100 text-green-700 border-green-300" : "bg-red-50 text-red-600 border-red-200"}`}>
                                                {animal.vacinado ? 'Vacinado' : 'Não vacinado'}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${animal.castrado ? "bg-green-100 text-green-700 border-green-300" : "bg-red-50 text-red-600 border-red-200"}`}>
                                                {animal.castrado ? 'Castrado' : 'Não castrado'}
                                            </span>
                                        </div>
                                        <div className="mt-auto flex justify-center">
                                            <Link
                                                href={`/${animal.especie.toLowerCase()}/${animal.slug}`}
                                                className="inline-block text-sm font-bold text-center py-2 px-5 rounded-xl transition-colors duration-200 bg-pink-600 text-white shadow hover:bg-pink-700"
                                            >
                                                Conhecer {animal.nome}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
