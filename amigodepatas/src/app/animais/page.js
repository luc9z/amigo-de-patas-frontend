'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { authService } from '@/services/api';
import FilterPanel from '@/components/filterPanel/filterPanel';
import Link from 'next/link';

export default function AnimaisPage() {
    const [animais, setAnimais] = useState([]);
    const [allAnimais, setAllAnimais] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        especie: '',
        porte: '',
        sexo: '',
        vacinado: null,
        castrado: null
    });

    useEffect(() => {
        fetchAnimais();
    }, []);

    useEffect(() => {
        if (allAnimais.length) {
            filterAnimais();
        }
    }, [filters, allAnimais]);

    const fetchAnimais = async () => {
        setLoading(true);
        try {
            const response = await authService.getAnimais();
            setAnimais(response);
            setAllAnimais(response);
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
                (filters.castrado !== null ? animal.castrado === filters.castrado : true)
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

                    <div className="mb-8">
                        <FilterPanel onFilterChange={handleFilterChange} />
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
                                        <a
                                            href={`/animais/${animal.id}`}
                                            className="block text-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                        >
                                            Conhecer {animal.nome}
                                        </a>
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