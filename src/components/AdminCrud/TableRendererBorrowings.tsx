import { FaCircleInfo } from 'react-icons/fa6';
// @ts-ignore - asset import handled by Next; declare file types in src/types/custom.d.ts
import RollingSpinner from '@/assets/animations/rolling-spinner.svg';
import { RiArrowTurnBackLine } from "react-icons/ri";

interface TableRowsProps {
    headers: string[];
    currentRecords: any[];
    onConfirmReturn: (id: number) => void;
    onMoreInfo: (id: number) => void;
    isLoading: boolean;
}

const TableRows: React.FC<TableRowsProps> = ({ headers, currentRecords, onConfirmReturn, onMoreInfo, isLoading }) => {
    if (isLoading) {
        return (
            <tr>
                <td rowSpan={6} colSpan={6} className="text-center">
                    <div className="flex justify-center items-center pt-6">
                        <RollingSpinner width={80} height={80} />
                    </div>
                    <h1 className="flex justify-center items-center pt-6 font-semibold text-lg">
                        Cargando contenido ...
                    </h1>
                </td>
            </tr>
        );
    }

    if (currentRecords.length === 0) {
        return (
            <tr>
                <td rowSpan={6} colSpan={6} className="text-center">
                    <h1 className="flex justify-center items-center pt-6 font-semibold text-lg">
                        No hay elementos para mostrar
                    </h1>
                </td>
            </tr>
        );
    }

    return (
        <>
            {currentRecords.map((row: any, rowIndex: number) => {
                const idKey = Object.keys(row)[0];
                const idValue = row[idKey];
                const showConfirmReturn = row.status === "BORROWED";

                return (
                    <tr key={`row-${idValue}-${rowIndex}`}>
                        {headers.map((header: string, headerIndex: number) => (
                            <td key={`${header}-${idValue}-${headerIndex}`} className="truncate max-w-[200px]">
                                {row[header]}
                            </td>
                        ))}
                        <td key={`actions-td-${idValue}`} className='flex justify-end space-x-4'>
                            {showConfirmReturn && (
                                <button
                                    className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center hover:bg-secondary"
                                    onClick={() => onConfirmReturn(idValue)}
                                >
                                    <RiArrowTurnBackLine size={16} />
                                </button>
                            )}
                            <button
                                className="text-secondary w-8 h-8 flex items-center justify-center"
                                onClick={() => onMoreInfo(idValue)}
                            >
                                <FaCircleInfo size={26} />
                            </button>
                        </td>

                    </tr>
                );
            })}
        </>
    );
};

interface TableHeadersProps {
    headers: string[];
}

const TableHeaders: React.FC<TableHeadersProps> = ({ headers }) => {
    return (
        <tr className="text-lg">
            {headers.map((header: string, index: number) => (
                <th key={`${header}-${index}`}>{header.toUpperCase()}</th>
            ))}
            <th key="actions-th"></th>
        </tr>
    );
};

export { TableRows, TableHeaders };
