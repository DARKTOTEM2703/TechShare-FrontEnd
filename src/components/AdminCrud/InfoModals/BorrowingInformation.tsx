import React from "react";

interface BorrowDetailsProps {
    borrow: {
        borrowId: number;
        startDate: string | null;
        endDate: string | null;
        returnDate: string | null;
        status: string;
        usuarioName: string;
        usuarioId: number;
        details: {
            detailsBorrowId: number;
            materialName: string;
            quantity: number;
        }[];
    };
    onClose: () => void;
}

const BorrowDetails: React.FC<BorrowDetailsProps> = ({ borrow, onClose }) => {
    const renderStatus = (status: string) => {
        switch (status) {
            case "BORROWED":
                return (
                    <div className="border border-orange-500 text-orange-500 px-4 py-2 rounded-lg mt-1 text-sm font-semibold">
                        PRÉSTAMO ACTIVO
                    </div>
                );
            case "RETURNED":
                return (
                    <div className="border border-green-500 text-green-500 px-4 py-2 rounded-lg mt-1 text-sm font-semibold">
                        PRÉSTAMO FINALIZADO
                    </div>
                );
            case "REJECETD":
                return (
                    <div className="border border-red-500 text-red-500 px-4 py-2 rounded-lg mt-1 text-sm font-semibold">
                        PRÉSTAMO RECHAZADO
                    </div>
                );
            default:
                return (
                    <div className="border border-gray-400 text-gray-400 px-4 py-2 rounded-lg mt-1 text-sm font-semibold">
                        ESTADO DESCONOCIDO
                    </div>
                );
        }
    };

    return (
        <div className="modal-overlay">
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[600px]">
                    <h2 className="text-lg font-semibold mb-4 text-primary">
                        Detalles del préstamo
                    </h2>
                    <hr className="mb-4" />

                    <div className="flex items-start gap-6 mb-6">
                        {/* Foto de usuario */}
                        <div className="flex-shrink-0 w-32 h-32 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">Foto Usuario</span>
                        </div>

                        {/* Información del usuario */}
                        <div className="flex-1">
                            <div className="mb-4">
                                <h4 className="font-semibold text-sm text-primary">Nombre</h4>
                                <div className="border border-primary px-4 py-2 rounded-lg mt-1 text-sm">
                                    {borrow.usuarioName}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-primary">E-mail</h4>
                                <div className="border border-primary px-4 py-2 rounded-lg mt-1 text-sm">
                                    {`user${borrow.usuarioId}@example.com`}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fechas del préstamo */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <h4 className="font-semibold text-sm text-primary">Fecha de inicio</h4>
                            <div className="border border-primary px-4 py-2 rounded-lg mt-1 text-sm">
                                {borrow.startDate || "--"}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-primary">Fecha límite</h4>
                            <div className="border border-primary px-4 py-2 rounded-lg mt-1 text-sm">
                                {borrow.endDate || "--"}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-primary">Fecha de devolución</h4>
                            <div className="border border-primary px-4 py-2 rounded-lg mt-1 text-sm">
                                {borrow.returnDate || "--"}
                            </div>
                        </div>
                    </div>

                    {/* Materiales prestados y Estado del préstamo */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            <h4 className="font-semibold text-sm text-primary">Materiales prestados</h4>
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold text-sm text-primary mr-2">Status</span>
                            {renderStatus(borrow.status)}
                        </div>
                    </div>

                    <div className="border border-primary rounded-lg overflow-hidden">
                        <table className="table-auto w-full text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-sm font-semibold text-primary border-b">
                                        Nombre del material
                                    </th>
                                    <th className="px-4 py-2 text-sm font-semibold text-primary border-b">
                                        Cantidad
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrow.details.map((detail) => (
                                    <tr key={detail.detailsBorrowId}>
                                        <td className="px-4 py-2 text-sm border-b">{detail.materialName}</td>
                                        <td className="px-4 py-2 text-sm border-b">{detail.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
            </div>
        </div>
    );
};

export default BorrowDetails;
