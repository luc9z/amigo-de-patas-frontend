'use client';

import React, { useState } from 'react';

export default function FilterPanel({ onFilterChange }) {
    const [especie, setEspecie] = useState('');
    const [porte, setPorte] = useState('');
    const [sexo, setSexo] = useState('');
    const [vacinado, setVacinado] = useState(null);
    const [castrado, setCastrado] = useState(null);
    const [lar_temporario, setLarTemporario] = useState(null);
    const [adotado, setAdotado] = useState(null);

    const handleEspecieChange = (e) => {
        const val = e.target.value;
        setEspecie(val);
        onFilterChange({ especie: val });
    };

    const handlePorteChange = (e) => {
        const val = e.target.value;
        setPorte(val);
        onFilterChange({ porte: val });
    };

    const handleSexoChange = (e) => {
        const val = e.target.value;
        setSexo(val);
        onFilterChange({ sexo: val });
    };

    const handleVacinadoChange = (e) => {
        const val = e.target.checked;
        setVacinado(val);
        onFilterChange({ vacinado: val });
    };

    const handleCastradoChange = (e) => {
        const val = e.target.checked;
        setCastrado(val);
        onFilterChange({ castrado: val });
    };

    const handleLarTemporarioChange = (e) => {
        const val = e.target.checked;
        setLarTemporario(val);
        onFilterChange({ lar_temporario: val });
    };

    const handleAdotadoChange = (e) => {
        const val = e.target.checked;
        setAdotado(val);
        onFilterChange({ adotado: val });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Filtros</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Espécie</label>
                    <select value={especie} onChange={handleEspecieChange} className="w-full p-2 border border-gray-300 rounded">
                        <option value="">Todas</option>
                        <option value="cachorro">Cachorro</option>
                        <option value="gato">Gato</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Porte</label>
                    <select value={porte} onChange={handlePorteChange} className="w-full p-2 border border-gray-300 rounded">
                        <option value="">Todos</option>
                        <option value="pequeno">Pequeno</option>
                        <option value="medio">Médio</option>
                        <option value="grande">Grande</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                    <select value={sexo} onChange={handleSexoChange} className="w-full p-2 border border-gray-300 rounded">
                        <option value="">Todos</option>
                        <option value="macho">Macho</option>
                        <option value="fêmea">Fêmea</option>
                    </select>
                </div>
                <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={vacinado === true} onChange={handleVacinadoChange} className="h-5 w-5 rounded border-gray-300 text-pink-500 focus:ring-pink-400" />
                        <span className="text-sm text-gray-700">Vacinado</span>
                    </label>
                </div>
                <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={castrado === true} onChange={handleCastradoChange} className="h-5 w-5 rounded border-gray-300 text-pink-500 focus:ring-pink-400" />
                        <span className="text-sm text-gray-700">Castrado</span>
                    </label>
                </div>
                <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={lar_temporario === true} onChange={handleLarTemporarioChange} className="h-5 w-5 rounded border-gray-300 text-pink-500 focus:ring-pink-400" />
                        <span className="text-sm text-gray-700">Lar Temporário</span>
                    </label>
                </div>
                <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={adotado === true} onChange={handleAdotadoChange} className="h-5 w-5 rounded border-gray-300 text-pink-500 focus:ring-pink-400" />
                        <span className="text-sm text-gray-700">Adotado</span>
                    </label>
                </div>
            </div>
        </div>
    );
}