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
    const [showFilters, setShowFilters] = useState(false);

    const handleBooleanFilter = (stateSetter, filterName, value) => {
        const newValue = value ? true : null;
        stateSetter(newValue);
        onFilterChange({ [filterName]: newValue });
    };

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
        handleBooleanFilter(setVacinado, 'vacinado', e.target.checked && vacinado !== true);
    };
    const handleCastradoChange = (e) => {
        handleBooleanFilter(setCastrado, 'castrado', e.target.checked && castrado !== true);
    };
    const handleLarTemporarioChange = (e) => {
        handleBooleanFilter(setLarTemporario, 'lar_temporario', e.target.checked && lar_temporario !== true);
    };
    const handleAdotadoChange = (e) => {
        handleBooleanFilter(setAdotado, 'adotado', e.target.checked && adotado !== true);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <button
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-black font-semibold shadow transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 ${showFilters ? 'ring-2 ring-gray-300' : ''}`}
                onClick={() => setShowFilters((prev) => !prev)}
                aria-expanded={showFilters}
            >
                <span>Filtrar</span>
                <svg className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ${showFilters ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'} bg-white/90 border border-gray-200 rounded-2xl shadow-lg`}
                style={{
                    willChange: 'max-height, opacity',
                }}
            >
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Espécie</label>
                            <select value={especie} onChange={handleEspecieChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 bg-white text-black">
                                <option value="">Todas</option>
                                <option value="cachorro">Cachorro</option>
                                <option value="gato">Gato</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Porte</label>
                            <select value={porte} onChange={handlePorteChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 bg-white text-black">
                                <option value="">Todos</option>
                                <option value="pequeno">Pequeno</option>
                                <option value="medio">Médio</option>
                                <option value="grande">Grande</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Sexo</label>
                            <select value={sexo} onChange={handleSexoChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 bg-white text-black">
                                <option value="">Todos</option>
                                <option value="macho">Macho</option>
                                <option value="fêmea">Fêmea</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" checked={vacinado === true} onChange={handleVacinadoChange} className="h-5 w-5 rounded border-gray-200 text-gray-700 focus:ring-gray-400 transition" />
                                <span className="text-xs text-gray-800">Vacinado</span>
                            </label>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" checked={castrado === true} onChange={handleCastradoChange} className="h-5 w-5 rounded border-gray-200 text-gray-700 focus:ring-gray-400 transition" />
                                <span className="text-xs text-gray-800">Castrado</span>
                            </label>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" checked={lar_temporario === true} onChange={handleLarTemporarioChange} className="h-5 w-5 rounded border-gray-200 text-gray-700 focus:ring-gray-400 transition" />
                                <span className="text-xs text-gray-800">Lar Temporário</span>
                            </label>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" checked={adotado === true} onChange={handleAdotadoChange} className="h-5 w-5 rounded border-gray-200 text-gray-700 focus:ring-gray-400 transition" />
                                <span className="text-xs text-gray-800">Adotado</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}