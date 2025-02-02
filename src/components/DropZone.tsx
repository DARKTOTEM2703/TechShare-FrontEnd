import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneWithPreviewProps {
    onFileChange: (file: File | null) => void; // Función para pasar el archivo seleccionado al componente padre
    initialPreview?: string | null; // Opcional: Vista previa inicial
}

const DropzoneWithPreview: React.FC<DropzoneWithPreviewProps> = ({ onFileChange, initialPreview = null }) => {
    const [preview, setPreview] = useState<string | null>(initialPreview);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            onFileChange(file);
            setPreview(URL.createObjectURL(file)); // Crear una URL para previsualizar la imagen
        }
    }, [onFileChange]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false, // Solo permitir un archivo
    });

    return (
        <div {...getRootProps()} className="border-2 border-dashed rounded-lg border-gray-300 text-center cursor-pointer h-full">
            <input {...getInputProps()} />
            {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            ) : (
                <p className="flex items-center justify-center h-full px-4">Arrastra y suelta una imagen o da click para seleccionar una</p>
            )}
        </div>
    );
};

export default DropzoneWithPreview;
