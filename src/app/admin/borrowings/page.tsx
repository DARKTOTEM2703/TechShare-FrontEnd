"use client";
import React, { useEffect, useState } from "react";
import CrudHeader from "@/components/AdminCrud/CrudHeader";
import CrudBody from "@/components/AdminCrud/CrudBodyBorrowings";
import fetchData from "@/services/fetchData";
import endpoints from "@/app/infraestructure/config/configAPI";
import { getToken } from "@/services/storageService";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import BorrowingReturn from "@/components/AdminCrud/InfoModals/BorrowingReturn";
import BorrowingInformation from "@/components/AdminCrud/InfoModals/BorrowingInformation";
import "@/styles/modal.css";
import { Material } from "@/app/admin/catalog/interfaces/Material";
import { Borrow } from "@/app/admin/borrowings/interfaces/Borrow";

export default function Page() {
    const token = getToken() || "";

    const [data, setData] = useState<Borrow[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [selectedBorrow, setSelectedBorrow] = useState<Borrow | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBorrowDetails, setSelectedBorrowDetails] = useState<Borrow | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleSearchChange = (value: string) => setSearchTerm(value);

    const fetchBorrowings = async () => {
        setIsLoading(true);
        try {
            const data = await fetchData(endpoints.borrowings.getAll, token);
            // Mostrar todos los préstamos (PENDING, BORROWED, RETURNED, etc.)
            setData(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching borrowings:", error);
            setIsLoading(false);
        }
    };

    const fetchMaterials = async () => {
        try {
            const data = await fetchData(endpoints.materials.getAll, token);
            setMaterials(data);
        } catch (error) {
            console.error("Error fetching materials:", error);
        }
    };

    const { handleUpdate } = useCrudOperations(token, fetchBorrowings);

    const enrichBorrow = (borrow: Borrow): Borrow => {
        return {
            ...borrow,
            details: borrow.details.map((detail) => {
                const material = materials.find((mat) => mat.materialsId === detail.materialsId);
                return {
                    ...detail,
                    materialName: material ? material.name : "Desconocido", // Siempre asegura un string
                    materialImage: material ? material.imagePath : null,
                };
            }),
        };
    };

    const handleMoreInfo = (id: number) => {
        const borrow = data.find((item) => item.borrowId === id);
        if (borrow) {
            setSelectedBorrowDetails(enrichBorrow(borrow));
        }
    };

    const handleConfirmReturn = (id: number) => {
        const borrow = data.find((item) => item.borrowId === id);
        if (borrow) {
            setSelectedBorrow(enrichBorrow(borrow));
        }
    };

    const confirmReturn = () => {
        if (selectedBorrow) {
            const formData = new FormData();
            formData.append("status", "RETURNED");
            handleUpdate(endpoints.borrowings.update(selectedBorrow.borrowId), formData);
            setSelectedBorrow(null); // Cerrar modal
        }
    };

    const closeModal = () => {
        setSelectedBorrow(null);
    };

    useEffect(() => {
        fetchBorrowings();
        fetchMaterials();
    }, []);

    const filteredData = data.filter((borrow) =>
        (borrow.usuarioName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <CrudHeader
                dropdownOptions={["null"]}
                title="Préstamos"
                buttonDisabled={true}
                onSearchChange={handleSearchChange}
                buttonFunction={() => { }}
                buttonLabel=""
            />
            <CrudBody
                data={filteredData}
                headers={["borrowId", "usuarioName", "status", "startDate", "endDate"]}
                searchTerm={searchTerm}
                onMoreInfo={handleMoreInfo}
                onConfirmReturn={handleConfirmReturn}
                isLoading={isLoading}
            />
            {selectedBorrow && (
                <div className="modal-overlay">
                    <div className="fixed inset-0 flex items-center justify-center z-60">
                        <BorrowingReturn
                            borrow={selectedBorrow}
                            onClose={closeModal}
                            onConfirm={confirmReturn}
                        />
                    </div>
                </div>
            )}
            {selectedBorrowDetails && (
                <BorrowingInformation
                    borrow={selectedBorrowDetails}
                    onClose={() => setSelectedBorrowDetails(null)}
                />
            )}
        </div>
    );
}
