import { useState } from 'react';

export const useCrudOperations = (token: string, refreshData: () => void) => {
    const [clickedItemId, setClickedItemId] = useState<number | null>(null);

    const handleCreate = (url: string, data: FormData) => {
        fetch(url, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: data,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                refreshData();
            })
            .catch((error) => console.error("Error:", error));
    };


    const handleUpdate = (url: string, data: FormData) => {
        fetch(url, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: data,
        })
            .then((response) => response.json())
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