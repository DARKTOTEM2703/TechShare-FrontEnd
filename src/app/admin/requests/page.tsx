"use client";
import React, { useState, useEffect } from "react";
import CrudHeader from "@/components/AdminCrud/CrudHeader";
import CrudBody from "@/components/AdminCrud/CrudBodyRequests";
import RequestDetails from "@/components/AdminCrud/InfoModals/RequestInformation"; // Componente de Detalles de Solicitud
import fetchData from "@/services/fetchData";
import endpoints from "@/app/infraestructure/config/configAPI";
import { getToken } from "@/services/storageService";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import "@/styles/modal.css";
import { request } from "http";

export default function Page() {
    interface Request {
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
            borrowId: number;
        }[];
    }

    interface EnrichedRequest extends Omit<Request, "details"> {
        details: (Request["details"][number] & {
            materialName: string;
            materialImage: string | null;
            stock: number;
            borrowable_stock: number;
        })[];
    }

    interface Material {
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
    }

    const token = getToken() || "";

    const fetchRequests = () => {
        fetchData(endpoints.borrowings.getAll, token).then((data) => {
            const filteredData = data.filter(
                (request: Request) => request.status === "PROCCES"
            );
            setRequests(filteredData.reverse());
        });
    };

    const fetchMaterials = () => {
        fetchData(endpoints.materials.getAll, token).then((data) => {
            setMaterials(data);
        });
    };

    const [requests, setRequests] = useState<Request[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<EnrichedRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { handleUpdate } = useCrudOperations(token, fetchRequests);

    const handleStatusUpdate = (id: number, status: string) => {
        const formData = new FormData();
        formData.append("status", status);
        handleUpdate(endpoints.borrowings.update(id), formData);
    };

    const handleMoreInfo = (id: number) => {
        const request = requests.find((req) => req.borrowId === id);
        if (request) {
            const enrichedRequest: EnrichedRequest = {
                ...request,
                details: request.details.map((detail) => {
                    const material = materials.find(
                        (mat) => mat.materialsId === detail.materialsId
                    );
                    return {
                        ...detail,
                        materialName: material ? material.name : "Desconocido",
                        materialImage: material ? material.imagePath : null,
                        stock: material ? material.stock : 0,
                        borrowable_stock: material ? material.borrowable_stock : 0,
                    };
                }),
            };
            setSelectedRequest(enrichedRequest);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    useEffect(() => {
        if (token) {
            fetchRequests();
            fetchMaterials();
        }
    }, [token]);


    return (
        <div>
            <CrudHeader
                title="Solicitudes"
                dropdownOptions={["dummy"]}
                buttonLabel=" "
                buttonFunction={() => alert("")}
                buttonDisabled={true}
                onSearchChange={() => { }}
            />
            <CrudBody
                data={requests}
                headers={["borrowId", "usuarioName", "amount", "date"]}
                searchTerm=""
                onMoreInfo={handleMoreInfo}
                onDenial={(id: number) => handleStatusUpdate(id, "REJECETD")}
                onApproval={(id: number) => handleStatusUpdate(id, "BORROWED")} // Maneja la aprobación
            />
            {/* Modal de Detalles */}
            {isModalOpen && selectedRequest && (
                <div className="modal-overlay">
                    <div >
                        <RequestDetails request={selectedRequest} onClose={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
}
