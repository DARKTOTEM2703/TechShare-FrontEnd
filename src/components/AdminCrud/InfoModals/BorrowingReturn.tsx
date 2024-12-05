import React from "react";

interface BorrowingInformationProps {
    borrow: {
        borrowId: number;
        details: {
            detailsBorrowId: number;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            materialsId: number;
            materialName?: string; // Opcional si se enriquece
            materialImage?: string | null; // Opcional si se enriquece
        }[];
    };
    onClose: () => void;
    onConfirm: () => void;
}

const BorrowingInformation: React.FC<BorrowingInformationProps> = ({ borrow, onClose, onConfirm }) => {
    return (
        <div className="modal-overlay">
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]">
                    <h2 className="text-lg font-semibold mb-4 text-primary">
                        Confirmar devolución
                    </h2>
                    <hr className="mb-4" />
                    <h4 className="font-semibold mb-2 text-primary">Materiales a devolver:</h4>
                    <div className="border border-primary rounded-lg overflow-hidden mb-4">
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
                                        <td className="px-4 py-2 text-sm border-b">
                                            {detail.materialName || "Desconocido"}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b">{detail.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-400"
                        >
                            Cerrar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark"
                        >
                            Confirmar devolución
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BorrowingInformation;
