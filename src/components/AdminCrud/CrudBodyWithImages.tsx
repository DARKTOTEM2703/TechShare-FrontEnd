import React, { useState, useEffect } from 'react';
import '@/styles/crud-table.css';
import '@/styles/pagination.css';
import CardRenderer from '@/components/AdminCrud/CardRenderer';
import Pagination from '@/components/AdminCrud/Pagination';
import '@/styles/cards.css';

interface CrudBodyProps {
    data: any;
    searchTerm: string;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
    isLoading: boolean;
}

export default function CrudBody({ data, searchTerm, onDelete, onEdit, isLoading }: CrudBodyProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(data);

    const recordsPerPage = 6;
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filtered = Array.isArray(data)
            ? data.filter((item: any) =>
                Object.values(item).some((val: any) =>
                    String(val).toLowerCase().includes(lowercasedFilter)
                )
            )
            : [];
        setFilteredData(filtered);
    }, [searchTerm, data]);

    return (
        <div>
            <div className='card-list-container'>
                <CardRenderer
                    currentRecords={currentRecords}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    isLoading={isLoading}
                />
            </div>
            {!isLoading && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
                />
            )}
        </div>
    );
}
