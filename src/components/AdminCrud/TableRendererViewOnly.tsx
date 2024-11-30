import { FaCircleInfo } from 'react-icons/fa6';
import RollingSpinner from '@/assets/animations/rolling-spinner.svg';
interface TableRowsProps {
    headers: string[];
    currentRecords: any[];
    onSelected: (id: number) => void;
    onMoreInfo: (id: number) => void;
}

const TableRows: React.FC<TableRowsProps> = ({ headers, currentRecords, onSelected, onMoreInfo }) => {
    // Si currentRecords está vacío, mostramos el spinner
    if (currentRecords.length === 0) {
        return (
            <tr >
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
                const idKey = Object.keys(row)[0];
                const idValue = row[idKey];

                return (
                    <tr key={`row-${idValue}-${rowIndex}`}>
                        {headers.map((header: string, headerIndex: number) => (
                            <td key={`${header}-${idValue}-${headerIndex}`} onClick={() => onSelected(idValue)}>
                                {row[header]}
                            </td>
                        ))}
                        <td key={`actions-td-${idValue}`}>
                            <button className="action-button" onClick={() => onMoreInfo(idValue)}>
                                <FaCircleInfo />
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
