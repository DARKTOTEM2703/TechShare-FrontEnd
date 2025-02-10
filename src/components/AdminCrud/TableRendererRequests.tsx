import { FaCheck, FaTimes, FaQuestion } from 'react-icons/fa';  // Usando FaQuestion para el símbolo de interrogación
import RollingSpinner from '@/assets/animations/rolling-spinner.svg';

interface TableRowsProps {
    headers: string[];
    currentRecords: any[];
    onApproval: (id: number) => void;
    onDenial: (id: number) => void;
    onMoreInfo: (id: number) => void;
    isLoading: boolean;  // Nuevo prop
}

const TableRows: React.FC<TableRowsProps> = ({ headers, currentRecords, onApproval, onDenial, onMoreInfo, isLoading }) => {
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
                        No hay solicitudes pendientes
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

                return (
                    <tr key={`row-${idValue}-${rowIndex}`}>
                        {headers.map((header: string, headerIndex: number) => (
                            <td key={`${header}-${idValue}-${headerIndex}`} onClick={() => onMoreInfo(idValue)} className="truncate max-w-[200px]">
                                {row[header]}
                            </td>
                        ))}
                        <td key={`actions-td-${idValue}`} className="flex justify-end space-x-4">
                            <button
                                className="bg-green-500 text-white rounded-md w-8 h-8 flex items-center justify-center hover:bg-green-600"
                                onClick={() => onApproval(idValue)}
                            >
                                <FaCheck size={16} />
                            </button>
                            <button
                                className="bg-red-500 text-white rounded-md w-8 h-8 flex items-center justify-center hover:bg-red-600"
                                onClick={() => onDenial(idValue)}
                            >
                                <FaTimes size={16} />
                            </button>
                            <button
                                className="bg-secondary text-white rounded-md w-8 h-8 flex items-center justify-center hover:bg-blue-600"
                                onClick={() => onMoreInfo(idValue)}
                            >
                                <FaQuestion size={16} />
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
