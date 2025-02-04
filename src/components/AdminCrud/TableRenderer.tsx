import { FaEdit, FaTrash } from 'react-icons/fa';
import RollingSpinner from '@/assets/animations/rolling-spinner.svg';

interface TableRowsProps {
    headers: string[];
    currentRecords: any[];
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
}

const TableRows: React.FC<TableRowsProps> = ({ headers, currentRecords, onDelete ,onEdit}) => {
    if (currentRecords.length === 0) {
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
    return (
        <>
            {currentRecords.map((row: any, rowIndex: number) => {
                // Obtiene el nombre del primer atributo de cada objeto
                const idKey = Object.keys(row)[0]; 
                const idValue = row[idKey]; // Toma el valor del primer atributo como ID

                return (
                    <tr key={`row-${idValue}-${rowIndex}`}>
                        {headers.map((header: string, headerIndex: number) => (
                            <td key={`${header}-${idValue}-${headerIndex}`} className="truncate max-w-[200px]">
                                {row[header]}
                            </td>
                        ))}
                        <td key={`empty-td-${idValue}`} />
                        <td key={`actions-td-${idValue}`}>
                            <button className="action-button" onClick={() => onEdit(idValue)}>
                                <FaEdit />
                            </button>
                            <button className="action-button" onClick={() => onDelete(idValue)}>
                                <FaTrash />
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
    headerLabels: { [key: string]: string };
}

const TableHeaders: React.FC<TableHeadersProps> = ({ headers, headerLabels }) => {
    return (
        <tr className='text-lg'>
            {headers.map((header: string, index: number) => (
                <th key={`${header}-${index}`}>{headerLabels[header]}</th>
            ))}
            <th key="empty-th-1" />
            <th key="empty-th-2" />
        </tr>
    );
};

export { TableRows, TableHeaders };
