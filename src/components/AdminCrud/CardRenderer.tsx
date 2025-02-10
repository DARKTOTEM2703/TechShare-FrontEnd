import { FaEdit, FaTrash } from 'react-icons/fa';
import RollingSpinner from '@/assets/animations/rolling-spinner.svg';

interface CardRendererProps {
    currentRecords: any[];
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
    isLoading: boolean;
}

const CardRenderer: React.FC<CardRendererProps> = ({ currentRecords, onDelete, onEdit, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-[200px]">
                <div className="flex justify-center items-center pt-6">
                    <RollingSpinner width={80} height={80} />
                </div>
                <h1 className="flex justify-center items-center pt-6 font-semibold text-lg">
                    Cargando contenido ...
                </h1>
            </div>
        );
    }

    if (currentRecords.length === 0) {
        return (
            <div className="flex items-center justify-center w-full min-h-[200px]">
                <h1 className="font-semibold text-lg text-primary">
                    No hay elementos para mostrar
                </h1>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {currentRecords.map((item, index) => {
                const idKey = Object.keys(item)[0];
                const idValue = item[idKey];

                return (
                    <div key={`card-${idValue}-${index}`} className="bg-white rounded-lg shadow-sm w-full p-4 flex items-start space-x-4 relative shadow-black min-h-[120px]">
                        {item.imagePath ? (
                            <img
                                src={item.imagePath}
                                alt={item.name}
                                className="w-30 h-20 object-cover rounded-md border border-gray-300 outline-[3px] outline -outline-offset-1 outline-tertiary shadow-md shadow-black"
                                onError={(e) => {
                                    e.currentTarget.src = "/fallback-image.png"; // Imagen de respaldo en caso de error
                                }}
                            />
                        ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-gray-500">No Image</span>
                            </div>
                        )}
                        <div className="flex-1 h-20 flex items-center overflow-hidden">
                            {item.description ? (
                                <div className="w-full">
                                    <h3 className="text-lg font-semibold text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 overflow-hidden text-ellipsis line-clamp-2">
                                        {item.description}
                                    </p>
                                </div>
                            ) : (
                                <h3 className="text-lg font-semibold text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                                    {item.name}
                                </h3>
                            )}
                        </div>
                        <div className="absolute top-2 right-2 flex space-x-2">
                            <button
                                className="action-button" // Color original azul
                                onClick={() => onEdit(idValue)}
                            >
                                <FaEdit />
                            </button>
                            <button
                                className="action-button"
                                onClick={() => onDelete(idValue)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CardRenderer;
