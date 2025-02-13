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
                refreshData();
            })
            .catch((error) => alert(JSON.stringify(error.message)));
    };

    const handleUpdate = (url: string, data: any) => {
        fetchWithDynamicHeaders(url, "PUT", data)
            .then((response) => response.text())
            .then(() => {
                console.log("Updated successfully.");
                refreshData();
            })
            .catch((error) => alert(error.message));
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
            .catch((error) => alert(JSON.stringify(error.message)));
    };

    return {
        setClickedItemId,
        handleCreate,
        handleUpdate,
        handleDelete,
        clickedItemId,
    };
};
