import { useState } from 'react';

export const useCrudOperations = (token: string, refreshData: () => void) => {
    const [clickedItemId, setClickedItemId] = useState<number | null>(null);

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
        }).then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(`Error: ${response.status} ${response.statusText} - ${JSON.stringify(error.message)}`);
                });
            }
            return response;
        });
    };

    const handleCreate = (url: string, data: any) => {
        fetchWithDynamicHeaders(url, "POST", data)
            .then((response) => response.json())
            .then((data) => {
                console.log("Created:", data);
                refreshData();
            })
            .catch((error) => console.error(error));
    };

    const handleUpdate = (url: string, data: any) => {
        fetchWithDynamicHeaders(url, "PUT", data)
            .then((response) => response.json())
            .then(() => {
                console.log("Updated successfully.");
                refreshData();
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleDelete = (url: string) => {
        fetch(url, {
            method: "DELETE",
            headers: { Authorization: `${token}` },
        })
            .then(() => {
                console.log("Deleted successfully.");
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
