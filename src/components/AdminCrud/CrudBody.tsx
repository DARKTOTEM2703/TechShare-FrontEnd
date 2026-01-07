import React, { useState, useEffect, useMemo } from 'react';
import '@/styles/crud-table.css';
import '@/styles/pagination.css';
import '@/styles/animations.css';
import { isDataEmpty } from '@/utils/utils';
import { TableHeaders, TableRows } from '@/components/AdminCrud/TableRenderer';
import Pagination from '@/components/AdminCrud/Pagination';
import { AnimatedSection, ResponsiveTable } from '@/components/Ui/AnimatedComponents';

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

    // Optimize filtering with useMemo instead of useEffect
    const filteredData = useMemo(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        return Array.isArray(data)
            ? data.filter((item: any) =>
                Object.values(item).some((val: any) =>
                    String(val).toLowerCase().includes(lowercasedFilter)
                )
            )
            : [];
    }, [searchTerm, data]);

    const recordsPerPage = 6;
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

    //USE THIS ONLY IF: you want to show all headers, including "id"
    //const headers = data && data.length > 0 && !isDataEmpty(data) ? Object.keys(data[0]) : [];


    return (
        <div>
            {/* Wrapper responsive para tabla con scroll horizontal */}
            <AnimatedSection animation="slide-up" delay={100}>
                <ResponsiveTable className="white-container -mx-4 sm:mx-0">
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
