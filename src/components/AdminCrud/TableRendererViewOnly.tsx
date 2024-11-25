import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaCircleInfo } from 'react-icons/fa6';

interface TableRowsProps {
    headers: string[];
    currentRecords: any[];
    onSelected: (id: number) => void;
    onMoreInfo: (id: number) => void;
}

const TableRows: React.FC<TableRowsProps> = ({ headers, currentRecords, onSelected, onMoreInfo }) => {
    return (
        <>
            {currentRecords.map((row: any, rowIndex: number) => {
                const idKey = Object.keys(row)[0];
                const idValue = row[idKey];

                return (
                    <tr key={`row-${idValue}-${rowIndex}`}>{
                        headers.map((header: string, headerIndex: number) => (
                            <td key={`${header}-${idValue}-${headerIndex}`} onClick={() => onSelected(idValue)}>
                                {row[header]}
                            </td>
                        ))
                    }<td key={`actions-td-${idValue}`}>
                            <button className="action-button" onClick={() => onMoreInfo(idValue)}>
                                <FaCircleInfo />
                            </button>
                        </td></tr>
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
        <tr className='text-lg'>{
            headers.map((header: string, index: number) => (
                <th key={`${header}-${index}`}>{header.toUpperCase()}</th>
            ))
        }<th key="actions-th">Actions</th></tr>
    );
};

export { TableRows, TableHeaders };
