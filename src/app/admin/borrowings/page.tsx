"use client"
import React, { useEffect, useState } from 'react'
import CrudHeader from '@/components/AdminCrud/CrudHeader'
import CrudBody from '@/components/AdminCrud/CrudBodyBorrowings'
import fetchData from '@/services/fetchData'
import endpoints from '@/app/infraestructure/config/configAPI'
import { getToken } from '@/services/storageService'

export default function page() {

    const token = getToken()

    interface borrow {
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
        adminName: string;
        details: any;
    }

    const [data, setData] = useState<borrow[]>([])

    const filterBorrowings = (borrowings: borrow[]) => {
        return borrowings.filter(borrowing => borrowing.status === "BORROWED" || borrowing.status === "RETURNED");
    }

    const fetchBorrowings = () => {
        fetchData(endpoints.borrowings.getAll, token)
            .then((data) => {
                console.log(data);
                setData(filterBorrowings(data));
            })
    }

    useEffect(() => {
        fetchBorrowings()
    }, [])

    return (
        <div>
            <CrudHeader
                dropdownOptions={['null']}
                title='Préstamos'
                buttonDisabled={true}
                onSearchChange={() => { }}
                buttonFunction={() => { }}
                buttonLabel=''
            />
            <CrudBody
                data={data}
                headers={['borrowId', 'usuarioName', 'startDate', 'endDate', 'status']}
                searchTerm=''
                onMoreInfo={() => { }}
                onConfirmReturn={() => { }}
            />
        </div>
    )
}
