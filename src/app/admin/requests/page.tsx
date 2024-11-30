"use client"
import React, { useState, useEffect } from 'react'
import CrudHeader from '@/components/AdminCrud/CrudHeader'
import CrudBody from '@/components/AdminCrud/CrudBodyRequests'
import fetchData from '@/services/fetchData'
import endpoints from '@/app/infraestructure/config/configAPI'
import { getToken } from '@/services/storageService'
import { inter } from '@/services/fonts'

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

    const token = getToken()

    const [requests, setRequests] = useState<Request[]>([])

    const fetchRequests = () => {
        fetchData(endpoints.borrowings.getAll,token)
            .then((data) => setRequests(data))
    }

    useEffect(() => {
        fetchRequests()
        console.log(requests)
    }, [])

    return (
        <div>
            <CrudHeader
                title='Solicitudes'
                dropdownOptions={['dummy']}
                buttonLabel=' '
                buttonFunction={() => alert('')}
                buttonDisabled={true}
                onSearchChange={() => {}}
            />
            <CrudBody
                data={requests}
                headers={['usuarioName','amount', 'date']}
                searchTerm=''
                onMoreInfo={() => {}}
                onDenial={() => {}}
                onApproval={() => {}} 
            />
        </div>
    )
}
