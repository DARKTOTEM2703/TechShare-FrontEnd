import React, { useState, useEffect } from 'react';
import '@/styles/crud-table.css';
import '@/styles/pagination.css';
import { isDataEmpty } from '@/utils/utils'; // Eliminamos filterHeadersWithId
import { TableHeaders, TableRows } from '@/components/AdminCrud/TableRenderer';
import Pagination from '@/components/AdminCrud/Pagination';

interface CrudBodyProps {
    data: any;
    headers: string[];
    headerLabels: { [key: string]: string };
    searchTerm: string;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
    isLoading: boolean;
}

export default function CrudBody({ data, headers, headerLabels, searchTerm, onDelete, onEdit, isLoading }: CrudBodyProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(data);

    const recordsPerPage = 6;
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

    //USE THIS ONLY IF: you want to show all headers, including "id"
    //const headers = data && data.length > 0 && !isDataEmpty(data) ? Object.keys(data[0]) : [];

    // Filtrar los datos cuando el término de búsqueda cambia
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
            {/* Wrapper responsive para tabla con scroll horizontal */}
            <div className='white-container overflow-x-auto -mx-4 sm:mx-0'>
                <div className='inline-block min-w-full align-middle'>
                    <table className='crud-table min-w-full'>
                        <thead>
                            <TableHeaders headers={headers} headerLabels={headerLabels} />
                        </thead>
                        <tbody>
                            <TableRows
                                headers={headers}
                                currentRecords={currentRecords}
                                onDelete={onDelete}
                                onEdit={onEdit}
                                isLoading={isLoading}
                            />
                        </tbody>
                    </table>
                </div>
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
