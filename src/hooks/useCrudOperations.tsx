import { useState } from 'react';
import { useToast } from '@/components/Ui/ToastContext';

export const useCrudOperations = (token: string, refreshData: () => void) => {
    const [clickedItemId, setClickedItemId] = useState<number | null>(null);
    const toast = useToast();

    const fetchWithDynamicHeaders = (
        url: string,
        method: string,
        data: any
    ) => {
        const headers: HeadersInit = { Authorization: `${token}` };

        // Si no es FormData, añadimos Content-Type: application/json
        const body = data instanceof FormData ? data : JSON.stringify(data);
        if (!(data instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        return fetch(url, {
            method,
            headers,
            body,
        }).then(async response => {
            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const error = await response.json();
                    throw new Error(error.message);
                } else {
                    const text = await response.text();
                    throw new Error(text);
                }
            }
            return response;
        });
    };

    const handleCreate = (url: string, data: any) => {
        fetchWithDynamicHeaders(url, "POST", data)
            .then((response) => response.json())
            .then((data) => {
                console.log("Created:", data);
                toast.addToast('success', 'Elemento creado exitosamente');
                refreshData();
            })
            .catch((error) => {
                console.error("Error creating:", error);
                toast.addToast('error', `Error al crear: ${error.message || 'Error desconocido'}`);
            });
    };

    const handleUpdate = (url: string, data: any) => {
        fetchWithDynamicHeaders(url, "PUT", data)
            .then((response) => response.text())
            .then(() => {
                console.log("Updated successfully.");
                toast.addToast('success', 'Elemento actualizado exitosamente');
                refreshData();
            })
            .catch((error) => {
                console.error("Error updating:", error);
                toast.addToast('error', `Error al actualizar: ${error.message || 'Error desconocido'}`);
            });
    };

    const handleDelete = (url: string) => {
        fetch(url, {
            method: "DELETE",
            headers: { Authorization: `${token}` },
        })
            .then(() => {
                console.log("Deleted successfully.");
                toast.addToast('success', 'Elemento eliminado exitosamente');
                refreshData();
            })
            .catch((error) => {
                console.error("Error deleting:", error);
                toast.addToast('error', `Error al eliminar: ${error.message || 'Error desconocido'}`);
            });
    };

    return {
        setClickedItemId,
        handleCreate,
        handleUpdate,
        handleDelete,
        clickedItemId,
    };
};
