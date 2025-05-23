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
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-grow py-8">
                <div className="container mx-auto px-6">
                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="text-blue-500 hover:underline font-medium">
                            Página Inicial
                        </Link>
                        <span className="mx-1 text-gray-400">/</span>
                        <span className="text-gray-700 font-semibold">Animais</span>
                    </div>

                    <h1 className="text-3xl font-bold mb-4 text-black">Animais Disponíveis para Adoção</h1>

                    <div className="mb-8 flex justify-start">
                        <div className="w-full max-w-xs">
                            <FilterPanel onFilterChange={handleFilterChange} />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center">Carregando...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {animais.map((animal) => (
                                <div key={animal.id} className="w-72 h-[420px] border border-gray-200 rounded-xl shadow-md flex flex-col overflow-hidden bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in mx-auto">
                                    <div className="w-full h-[200px] relative">
                                        <img
                                            src={animal.imagemUrl || '/placeholder.jpg'}
                                            alt={animal.nome}
                                            className="w-full h-[200px] object-cover rounded-t-xl"
                                        />
                                        {animal.lar_temporario && (
                                            <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                                                🏠 Lar Temporário
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4 flex-grow text-center flex flex-col justify-between h-full">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1 text-black">{animal.nome}</h3>
                                            <p className="descricao-limitada mb-2 text-gray-700">Espécie: {animal.especie}</p>
                                            <p className="descricao-limitada mb-2 text-gray-600">Porte: {animal.porte}</p>
                                            <div className="flex justify-center gap-2 mb-3 flex-wrap">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-300">{animal.vacinado ? 'Vacinado' : 'Não vacinado'}</span>
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-300">{animal.castrado ? 'Castrado' : 'Não castrado'}</span>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/${animal.especie.toLowerCase()}/${animal.slug}`}
                                            className="mt-auto inline-block text-sm font-medium text-center py-2 px-4 rounded-md transition-colors duration-300 bg-pink-200 text-gray-800 hover:bg-pink-300"
                                        >
                                            Conhecer {animal.nome}
                                        </Link>
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
