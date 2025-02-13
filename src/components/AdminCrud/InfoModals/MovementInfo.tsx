import React from "react";
import { Movement } from "@/app/admin/movements/interfaces/Movement";

interface MovementInfoProps {
    movement: Movement;
    onClose: () => void;
}

const MovementInfo: React.FC<MovementInfoProps> = ({ movement, onClose }) => {
    return (
        <div className="p-6 bg-white shadow-md rounded-lg w-[500px] mx-auto relative">
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

            <h2 className="text-xl font-bold mb-4 text-primary">Información del movimiento</h2>
            <hr className="mb-6 border-gray-300" />

            {/* Nombre del material */}
            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Nombre del material:</label>
                <input
                    type="text"
                    value={movement.materialsName}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                />
            </div>

            {/* Comentarios */}
            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Comentarios:</label>
                <textarea
                    value={movement.comment}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none bg-gray-50"
                />
            </div>

            {/* Administrador */}
            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Administrador:</label>
                <span className="block p-2">{movement.adminName}</span>
            </div>

            {/* Información en línea (Tipo, Cantidad, Fecha) */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Tipo:</label>
                    <span className="block p-2">
                        {movement.moveType === 'IN' ? 'Entrada' : 'Salida'}
                    </span>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Cantidad:</label>
                    <span className="block p-2">{movement.quantity}</span>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Fecha:</label>
                    <span className="block p-2">{movement.date}</span>
                </div>
            </div>
        </div>
    );
};

export default MovementInfo; 