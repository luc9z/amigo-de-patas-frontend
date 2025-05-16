'use client';

export default function FilterPanel({ onFilterChange }) {
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        onFilterChange({ [name]: value });
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        onFilterChange({ [name]: checked });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">Filtrar Animais</h3>
            <div className="space-y-2">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Espécie:</label>
                    <select name="especie" onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Todos</option>
                        <option value="cachorro">Cachorro</option>
                        <option value="gato">Gato</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Porte:</label>
                    <select name="porte" onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Todos</option>
                        <option value="pequeno">Pequeno</option>
                        <option value="medio">Médio</option>
                        <option value="grande">Grande</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">Sexo:</label>
                    <select name="sexo" onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Todos</option>
                        <option value="macho">Macho</option>
                        <option value="femea">Fêmea</option>
                    </select>
                </div>
                <div>
                    <label className="inline-flex items-center">
                        <input type="checkbox" name="vacinado" onChange={handleCheckboxChange} className="form-checkbox h-5 w-5 text-blue-600" />
                        <span className="ml-2 text-gray-700 text-sm font-bold">Vacinado</span>
                    </label>
                </div>
                <div>
                    <label className="inline-flex items-center">
                        <input type="checkbox" name="castrado" onChange={handleCheckboxChange} className="form-checkbox h-5 w-5 text-blue-600" />
                        <span className="ml-2 text-gray-700 text-sm font-bold">Castrado</span>
                    </label>
                </div>
            </div>
        </div>
    );
}