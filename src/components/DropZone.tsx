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
        <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            {preview ? (
                <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
            ) : (
                <p>Drag & drop an image here, or click to select one</p>
            )}
        </div>
    );
};

export default DropzoneWithPreview;
