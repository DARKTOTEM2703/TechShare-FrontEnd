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
                setRequests(filteredData.reverse())
            })
    }

    const [requests, setRequests] = useState<Request[]>([])
    const { setClickedItemId, handleCreate, handleUpdate, handleDelete, clickedItemId } = useCrudOperations(token, fetchRequests);

    // Función para realizar el PUT con FormData
    const handleStatusUpdate = (id: number) => {
        const formData = new FormData();
        formData.append('status', 'BORROWED');
        handleUpdate(endpoints.borrowings.update(id), formData)
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
