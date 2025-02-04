import React from "react";
import BorderRichTextBox from "@/components/Inputs/BorderRichTextBox";

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
    onClose: () => void;
}

const MaterialInfo: React.FC<MaterialInfoProps> = ({ material, onClose }) => {
    return (
        <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto relative">
            {/* Botón de cerrar (X) */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                aria-label="Cerrar modal"
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

            <h2 className="text-lg font-bold mb-4 text-primary">Información del Material</h2>
            <hr className="my-4 border-gray-300" />

            {/* Imagen, Nombre y Stocks */}
            <div className="flex items-start mb-4">
                <div className="w-48 h-32 relative mr-4">
                    <img
                        src={material.imagePath}
                        alt="Material"
                        className="rounded w-full h-full object-contain"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    {/* Nombre */}
                    <h3 className="font-semibold text-lg text-primary mb-2">Nombre del material</h3>
                    <div className="border border-primary px-4 py-2 rounded-lg mb-4 text-sm">
                        <p className="truncate w-full">{material.name}</p>
                    </div>
                    {/* Stocks */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-sm text-primary">Stock Disponible</h4>
                            <p className="text-gray-800 mt-1 text-sm">{material.borrowable_stock}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-primary">Stock Real</h4>
                            <p className="text-gray-800 mt-1 text-sm">{material.stock}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Descripción */}
            <div className="mb-4">
                <h4 className="font-semibold text-lg text-primary">Descripción</h4>
                <BorderRichTextBox
                    placeholder="Descripción del material"
                    name="description"
                    value={material.description}
                    onChange={() => {}}
                    className="bg-gray-50"
                    readOnly={true}
                />
            </div>

            {/* Subcategoría */}
            <div className="mb-4">
                <h4 className="font-semibold text-lg text-primary">Subcategoría</h4>
                <div className="border border-primary px-4 py-2 rounded-lg mt-1 text-sm">
                    <p className="truncate">{material.subCategoryName}</p>
                </div>
            </div>

            {/* Roles */}
            <div className="mb-4">
                <h4 className="font-semibold text-lg text-primary">Roles asignados</h4>
                <div className="border border-primary px-4 py-2 rounded-lg mt-1 text-sm">
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(material.roleNames) && material.roleNames.length > 0 ? (
                            material.roleNames.map((role: string, index: number) => (
                                <span
                                    key={index}
                                    className="bg-tertiary text-white text-sm px-3 py-1 rounded-lg"
                                >
                                    {role}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500">Sin roles asignados</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialInfo;
