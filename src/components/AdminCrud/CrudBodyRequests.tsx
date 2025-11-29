import React, { useState, useEffect } from 'react';
import '@/styles/crud-table.css';
import '@/styles/pagination.css';
import '@/styles/animations.css';
import { isDataEmpty } from '@/utils/utils';
import { TableHeaders, TableRows } from '@/components/AdminCrud/TableRendererRequests';
import Pagination from '@/components/AdminCrud/Pagination';
import { AnimatedSection, ResponsiveTable } from '@/components/Ui/AnimatedComponents';

interface CrudBodyProps {
    data: any;
    headers: string[];
    searchTerm: string;
    onMoreInfo: (id: number) => void;
    onDenial: (id: number) => void;
    onApproval: (id: number) => void;
    isLoading: boolean;
}

export default function CrudBody({ data, headers, searchTerm, onMoreInfo, onDenial, onApproval, isLoading }: CrudBodyProps) {
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
            <AnimatedSection animation="slide-up" delay={100}>
                <ResponsiveTable className="white-container">
                    <table className='crud-table'>
                        <thead>
                            <TableHeaders headers={headers} />
                        </thead>
                        <tbody>
                            <TableRows
                                onApproval={onApproval}
                                onDenial={onDenial}
                                onMoreInfo={onMoreInfo}
                                headers={headers}
                                currentRecords={currentRecords}
                                isLoading={isLoading}
                            />
                        </tbody>
                    </table>
                </ResponsiveTable>
            </AnimatedSection>
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
