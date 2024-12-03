import React from "react";

interface MaterialInfoProps {
    material: {
        materialsId: number;
        imagePath: string;
        name: string;
        description: string;
        price: number;
        stock: number;
        borrowable_stock: number;
        subCategoryId: number;
        subCategoryName: string;
        roleIds: number[];
        roleNames: string[];
    };
    onClose: () => void; // Función para cerrar el modal
}

const MaterialInfo: React.FC<MaterialInfoProps> = ({ material, onClose }) => {
    return (
        <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto relative">
            {/* Botón de cerrar (X) */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            <h2 className="text-lg font-bold mb-4 text-primary">Material Info</h2>
            <hr className="my-4 border-gray-300" />

            {/* Imagen y Nombre */}
            <div className="flex items-start mb-4">
                <img
                    src={material.imagePath}
                    alt="Material"
                    className="w-16 h-16 object-contain mr-4"
                />
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-700">Nombre del material</h3>
                    <div className="border border-primary px-4 py-2 rounded-lg mt-1">
                        {material.name}
                    </div>
                </div>
            </div>

            {/* Stocks */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <h4 className="font-semibold text-gray-700">Available Stock</h4>
                    <p className="text-gray-800 mt-1">{material.borrowable_stock}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-700">Real Stock</h4>
                    <p className="text-gray-800 mt-1">{material.stock}</p>
                </div>
            </div>

            {/* Descripción */}
            <div className="mb-4">
                <h4 className="font-semibold text-gray-700">Descripción</h4>
                <div className="border border-primary px-4 py-2 rounded-lg mt-1">
                    {material.description}
                </div>
            </div>

            {/* Subcategoría */}
            <div className="mb-4">
                <h4 className="font-semibold text-gray-700">Subcategoría</h4>
                <div className="border border-primary px-4 py-2 rounded-lg mt-1">
                    {material.subCategoryName}
                </div>
            </div>

            {/* Roles */}
            <div className="mb-4">
                <h4 className="font-semibold text-gray-700">Roles de material</h4>
                <div className="border border-primary px-4 py-2 rounded-lg mt-1">
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(material.roleNames) &&
                            material.roleNames.map((role: string, index: number) => (
                                <span
                                    key={index}
                                    className="bg-tertiary text-white text-sm px-3 py-1 rounded-lg"
                                >
                                    {role}
                                </span>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialInfo;
