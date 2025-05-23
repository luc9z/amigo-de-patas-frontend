'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authService } from '@/services/api';
import FilterPanel from '@/app/components/filterPanel';
import Link from 'next/link';
import { Menu } from 'lucide-react';
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
        lar_temporario: null
    });
    const [showFilters, setShowFilters] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        // Lê a query string para aplicar filtro inicial
        const especie = searchParams.get('especie');
        if (especie) {
            setFilters((prev) => ({ ...prev, especie }));
            setShowFilters(true);
        }
        fetchAnimais();
        // eslint-disable-next-line
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
            // Filtra apenas animais NÃO adotados
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
                (filters.lar_temporario !== null ? animal.lar_temporario === filters.lar_temporario : true)
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
                    <div className="mb-4">
                        <Link href="/" className="text-blue-500 hover:underline">
                            Página Inicial
                        </Link>
                        <span> / Animais</span>
                    </div>

                    <h1 className="text-3xl font-bold mb-4">Animais Disponíveis para Adoção</h1>

                    <div className="mb-8 flex gap-4 flex-col">
                        <button
                            className="w-[10vh] flex gap-2 px-4 py-2 bg-gray-100 rounded-md shadow hover:bg-gray-200 transition text-gray-700"
                            onClick={() => setShowFilters((prev) => !prev)}
                        >
                            <Menu size={22} />
                            <span className="font-medium">Filtros</span>
                        </button>
                        {showFilters && (
                            <div className="w-full max-w-lg">
                                <FilterPanel onFilterChange={handleFilterChange} />
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center">Carregando...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {animais.map((animal) => (
                                <div key={animal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <img
                                        src={animal.imagemUrl}
                                        alt={animal.nome}
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold mb-2">{animal.nome}</h3>
                                        <p className="text-gray-600 mb-2">Espécie: {animal.especie}</p>
                                        <p className="text-gray-600 mb-4">Porte: {animal.porte}</p>
                                        <div className="flex space-x-2 mb-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${animal.vacinado ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                        {animal.vacinado ? 'Vacinado' : 'Não Vacinado'}
                      </span>
                                            <span className={`px-2 py-1 text-xs rounded-full ${animal.castrado ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-600'}`}>
                        {animal.castrado ? 'Castrado' : 'Não Castrado'}
                      </span>
                                        </div>
                                        <Link
                                            href={`/${animal.especie.toLowerCase()}/${animal.slug}`}
                                            className="block text-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
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