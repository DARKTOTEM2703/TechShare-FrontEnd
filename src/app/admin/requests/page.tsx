"use client"
import React, { useState, useEffect } from 'react'
import CrudHeader from '@/components/AdminCrud/CrudHeader'
import CrudBody from '@/components/AdminCrud/CrudBodyRequests'
import fetchData from '@/services/fetchData'
import endpoints from '@/app/infraestructure/config/configAPI'
import { getToken } from '@/services/storageService'
import { useCrudOperations } from '@/hooks/useCrudOperations'

export default function page() {

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
    }

    const token = getToken() || ''

    const fetchRequests = () => {
        fetchData(endpoints.borrowings.getAll, token)
            .then((data) => {
                const filteredData = data.filter((request: Request) => request.status === 'PROCCES')
                setRequests(filteredData)
            })
    }

    const [requests, setRequests] = useState<Request[]>([])

    // Función para realizar el PUT con FormData
    const handleStatusUpdate = (id: number) => {
        // Construimos la URL de la API para la solicitud PUT
        const url = `${endpoints.borrowings.update(id)}`;

        // Creamos el objeto FormData y agregamos el nuevo estado
        const formData = new FormData();
        formData.append('status', 'BORROWED');

        // Hacemos la solicitud PUT con FormData
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `${token}`, // Agregar token de autenticación si es necesario
            },
            body: formData, // Enviamos el FormData con los datos
        })
            .then(response => response.text())
            .then(text => console.log(text))
            .then(() => {
                // Si la actualización fue exitosa, volvemos a obtener las solicitudes actualizadas
                fetchRequests();
            })
            .catch(error => {
                console.error("Error al actualizar el estado:", error);
            });
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    return (
        <div>
            <CrudHeader
                title='Solicitudes'
                dropdownOptions={['dummy']}
                buttonLabel=' '
                buttonFunction={() => alert('')}
                buttonDisabled={true}
                onSearchChange={() => { }}
            />
            <CrudBody
                data={requests}
                headers={['borrowId', 'usuarioName', 'amount', 'date']}
                searchTerm=''
                onMoreInfo={() => { }}
                onDenial={() => { }}
                onApproval={(id: number) => handleStatusUpdate(id)}  // Aquí se invoca handleStatusUpdate al aprobar
            />
        </div>
    )
}
