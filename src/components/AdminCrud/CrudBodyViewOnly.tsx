import React, { useState, useEffect } from 'react';
import '@/styles/crud-table.css';
import '@/styles/pagination.css';
import { isDataEmpty } from '@/utils/utils';
import { TableHeaders, TableRows } from '@/components/AdminCrud/TableRendererViewOnly';
import Pagination from '@/components/AdminCrud/Pagination';

interface CrudBodyProps {
    data: any;
    headers: string[];
    headerLabels?: { [key: string]: string };
    searchTerm: string;
    onSelected: (id: number) => void;
    onMoreInfo: (id: number) => void;
    isLoading: boolean;
}

export default function CrudBody({ data, headers, headerLabels = {}, searchTerm, onSelected, onMoreInfo, isLoading }: CrudBodyProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(data);

    const recordsPerPage = 6;
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

    //const headers = data && data.length > 0 && !isDataEmpty(data) ? Object.keys(data[0]) : [];

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
            <div className='white-container'>
                <table className='crud-table'>
                    <thead>
                        <TableHeaders headers={headers} headerLabels={headerLabels} />
                    </thead>
                    <tbody>
                        <TableRows
                            onSelected={onSelected}
                            onMoreInfo={onMoreInfo}
                            headers={headers}
                            currentRecords={currentRecords}
                            isLoading={isLoading}
                        />
                    </tbody>
                </table>
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
