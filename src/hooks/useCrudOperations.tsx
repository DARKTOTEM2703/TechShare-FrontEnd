import { useState } from 'react';

export const useCrudOperations = (token: string, refreshData: () => void) => {
    const [clickedItemId, setClickedItemId] = useState<number | null>(null);

    const handleCreate = (url: string, data: any) => {
        fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            refreshData();
        })
        .catch((error) => console.error("Error:", error));
    };

    const handleUpdate = (url: string, data: any) => {
        fetch(url, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(() => {
            refreshData();
        })
        .catch((error) => console.error("Error:", error));
    };

    const handleDelete = (url: string) => {
        fetch(url, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            refreshData();
        })
        .catch((error) => console.error("Error:", error));
    };

    return {
        setClickedItemId,
        handleCreate,
        handleUpdate,
        handleDelete,
        clickedItemId,
    };
};
