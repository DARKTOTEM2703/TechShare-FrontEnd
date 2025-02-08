import React from "react";

interface RequestDetailsProps {
    request: {
        borrowId: number;
        date: string;
        startDate: string | null;
        endDate: string | null;
        returnDate: string | null;
        status: string;
        amount: number;
        usuarioId: number;
        usuarioName: string;
        adminId: number;
        adminName: string | null;
        details: {
            detailsBorrowId: number;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            materialsId: number;
            materialName: string;
            materialImage: string | null;
            stock: number;
            borrowable_stock: number;
        }[];
    };
    onClose: () => void;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ request, onClose }) => {
    return (
        <div className="p-6 bg-white shadow-md rounded-lg max-w-2xl mx-auto relative">
            {/* Botón de cerrar */}
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

            <h2 className="text-lg font-bold mb-4 text-primary">Detalles de la solicitud</h2>
            <hr className="my-4 border-gray-300" />

            {/* Información del usuario */}
            <div className="flex items-start gap-6 mb-6">
                {/* Foto del usuario */}
                <div className="w-36 h-36 border-2 border-dashed border-primary rounded-lg flex items-center justify-center text-center text-gray-500">
                    Foto Usuario
                </div>
                {/* Nombre y Email */}
                <div className="flex-1">
                    <div className="mb-4">
                        <h4 className="font-semibold text-sm text-primary">Nombre</h4>
                        <div className="border border-primary px-4 py-2 rounded-lg mt-1 text-sm">
                            <p className="truncate max-w-[200px]">{request.usuarioName}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-primary">E-mail</h4>
                        <div className="border border-primary px-4 py-2 rounded-lg mt-1 text-sm">
                            <p className="truncate">{request.usuarioId ? `user${request.usuarioId}@example.com` : "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Materiales solicitados */}
            <h3 className="font-semibold text-lg text-primary mb-4">Materiales solicitados</h3>
            <div className="border border-primary rounded-lg overflow-hidden">
                <div className="overflow-y-auto max-h-64">
                    <table className="table-auto w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-sm font-semibold text-primary border-b">
                                    Imagen
                                </th>
                                <th className="px-4 py-2 text-sm font-semibold text-primary border-b">
                                    Nombre
                                </th>
                                <th className="px-4 py-2 text-sm font-semibold text-primary border-b">
                                    Stock Real
                                </th>
                                <th className="px-4 py-2 text-sm font-semibold text-primary border-b">
                                    Stock Prest.
                                </th>
                                <th className="px-4 py-2 text-sm font-semibold text-primary border-b">
                                    Cantidad
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {request.details.map((detail) => (
                                <tr key={detail.detailsBorrowId}>
                                    <td className="px-4 py-2 text-sm border-b">
                                        {detail.materialImage ? (
                                            <img
                                                src={detail.materialImage}
                                                alt={detail.materialName}
                                                className="w-12 h-12 object-contain rounded-lg"
                                            />
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-sm border-b">
                                        <p className="truncate max-w-[200px]">{detail.materialName}</p>
                                    </td>
                                    <td className="px-4 py-2 text-sm border-b text-center">
                                        {detail.stock}
                                    </td>
                                    <td className="px-4 py-2 text-sm border-b text-center">
                                        {detail.borrowable_stock}
                                    </td>
                                    <td className="px-4 py-2 text-sm border-b text-center">
                                        {detail.quantity}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Botón de cerrar */}
            <div className="mt-6 text-right">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow hover:bg-primary-dark"
                >
                    CERRAR
                </button>
            </div>
        </div>
    );
};

export default RequestDetails;
