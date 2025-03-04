import { FaCircleInfo } from 'react-icons/fa6';
import RollingSpinner from '@/assets/animations/rolling-spinner.svg';
interface TableRowsProps {
    headers: string[];
    currentRecords: any[];
    onSelected: (id: number) => void;
    onMoreInfo: (id: number) => void;
    isLoading: boolean;
}

const TableRows: React.FC<TableRowsProps> = ({ headers, currentRecords, onSelected, onMoreInfo, isLoading }) => {
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

                return (
                    <tr key={`row-${idValue}-${rowIndex}`}>
                        {headers.map((header: string, headerIndex: number) => (
                            <td key={`${header}-${idValue}-${headerIndex}`} onClick={() => onSelected(idValue)} className="truncate max-w-[200px]">
                                {row[header]}
                            </td>
                        ))}
                        <td key={`actions-td-${idValue}`}>
                            <button className="text-secondary transition-transform hover:scale-125" onClick={() => onMoreInfo(idValue)}>
                                <FaCircleInfo size={20}/>
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
    headerLabels?: { [key: string]: string };
}

const TableHeaders: React.FC<TableHeadersProps> = ({ headers, headerLabels = {} }) => {
    return (
        <tr className="text-lg">
            {headers.map((header: string, index: number) => (
                <th key={`${header}-${index}`}>
                    {(headerLabels[header] || header)}
                </th>
            ))}
            <th key="actions-th"></th>
        </tr>
    );
};

export { TableRows, TableHeaders };
