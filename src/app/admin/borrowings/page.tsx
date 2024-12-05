"use client";
import React, { useEffect, useState } from "react";
import CrudHeader from "@/components/AdminCrud/CrudHeader";
import CrudBody from "@/components/AdminCrud/CrudBodyBorrowings";
import fetchData from "@/services/fetchData";
import endpoints from "@/app/infraestructure/config/configAPI";
import { getToken } from "@/services/storageService";
import { useCrudOperations } from "@/hooks/useCrudOperations";
import BorrowingInformation from "@/components/AdminCrud/InfoModals/BorrowingInformation";

export default function Page() {
    const token = getToken() || "";

    interface Borrow {
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
            materialName?: string;
            materialImage?: string | null;
        }[];
    }

    interface Material {
        materialsId: number;
        imagePath: string;
        name: string;
        stock: number;
        borrowable_stock: number;
    }

    const [data, setData] = useState<Borrow[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [selectedBorrow, setSelectedBorrow] = useState<Borrow | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (value: string) => setSearchTerm(value);

    const fetchBorrowings = () => {
        fetchData(endpoints.borrowings.getAll, token).then((data) => {
            // Filtrar préstamos con estados específicos
            const filteredData = data.filter(
                (borrowing: Borrow) =>
                    borrowing.status === "BORROWED" || borrowing.status === "RETURNED"
            );
            setData(filteredData);
        });
    };

    const fetchMaterials = () => {
        fetchData(endpoints.materials.getAll, token).then((data) => {
            setMaterials(data);
        });
    };

    const { handleUpdate } = useCrudOperations(token, fetchBorrowings);

    // Enriquecer datos del préstamo con nombres e imágenes de materiales
    const enrichBorrow = (borrow: Borrow): Borrow => {
        return {
            ...borrow,
            details: borrow.details.map((detail) => {
                const material = materials.find((mat) => mat.materialsId === detail.materialsId);
                return {
                    ...detail,
                    materialName: material ? material.name : "Desconocido",
                    materialImage: material ? material.imagePath : null,
                };
            }),
        };
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
                data={data}
                headers={["borrowId","usuarioName", "status", "startDate", "endDate"]}
                searchTerm={searchTerm}
                onMoreInfo={(id) => console.log("Más información", id)}
                onConfirmReturn={handleConfirmReturn}
            />
            {selectedBorrow && (
                <BorrowingInformation
                    borrow={selectedBorrow}
                    onClose={closeModal}
                    onConfirm={confirmReturn}
                />
            )}
        </div>
    );
}
