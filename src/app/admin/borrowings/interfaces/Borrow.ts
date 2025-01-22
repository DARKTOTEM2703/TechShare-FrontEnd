export interface Borrow {
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
            materialName: string; // Ahora garantizamos que siempre es string
            materialImage: string | null; // No es opcional, tendrá null o un string
        }[];
    }