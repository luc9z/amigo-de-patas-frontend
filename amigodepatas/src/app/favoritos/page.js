"use client";

import { useEffect, useState } from 'react';
import { favoritoService } from '@/services/api';
import { authService } from '@/services/api';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function FavoritasPage() {
    const [animais, setAnimais] = useState([]);
    const [favoritos, setFavoritos] = useState([]);

    useEffect(() => {
        const fetchFavoritos = async () => {
            try {
                const favs = await favoritoService.getFavoritos();
                setFavoritos(favs.map(a => a.id));
            } catch (error) {
                console.error('Erro ao buscar favoritos:', error);
            }
        };

        const fetchAnimais = async () => {
            try {
                const data = await authService.getAnimais();
                setAnimais(data);
            } catch (error) {
                console.error('Erro ao buscar animais:', error);
            }
        };

        fetchFavoritos();
        fetchAnimais();
    }, []);

    const toggleFavorito = async (animalId) => {
        try {
            if (favoritos.includes(animalId)) {
                await favoritoService.removeFavorito(animalId);
                setFavoritos(prev => prev.filter(id => id !== animalId));
            } else {
                await favoritoService.addFavorito(animalId);
                setFavoritos(prev => [...prev, animalId]);
            }
        } catch (error) {
            console.error('Erro ao alternar favorito:', error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Animais Favoritos</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {animais.map(animal => (
                    <div key={animal.id} className="border p-4 rounded shadow">
                        <h2 className="text-lg font-semibold">{animal.nome}</h2>
                        <p>{animal.descricao}</p>
                        <button
                            onClick={() => toggleFavorito(animal.id)}
                            className="mt-2 text-red-500 hover:text-red-700"
                        >
                            {favoritos.includes(animal.id) ? <FaHeart /> : <FaRegHeart />}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
