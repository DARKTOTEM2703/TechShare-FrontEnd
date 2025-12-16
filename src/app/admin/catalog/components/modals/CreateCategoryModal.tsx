"use client"
import React from 'react';
import { createPortal } from 'react-dom';
import BorderTextField from '@/components/Inputs/BorderTextField';
import DropzoneWithPreview from '@/components/DropZone';
import ReactCrop from 'react-image-crop';
import '@/styles/modal.css';

interface CreateCategoryModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: {
        name: string;
        image: File | null;
        imagePreview: string | null;
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        name: string;
        image: File | null;
        imagePreview: string | null;
    }>>;
    isImageCropping: boolean;
    imageUrl: string;
    crop: any;
    setCrop: (crop: any) => void;
    imageRef: React.RefObject<HTMLImageElement>;
    previewImageRef: React.RefObject<HTMLCanvasElement>;
    onSelectFile: (file: File | null) => void;
    onImageLoad: any;
    applyCrop: (callback: (croppedFile: File, previewUrl: string) => void) => void;
    ASPECT_RATIO: number;
    MIN_WIDTH: number;
}

export default function CreateCategoryModal({
    isVisible,
    onClose,
    onSubmit,
    formData,
    setFormData,
    isImageCropping,
    imageUrl,
    crop,
    setCrop,
    imageRef,
    previewImageRef,
    onSelectFile,
    onImageLoad,
    applyCrop,
    ASPECT_RATIO,
    MIN_WIDTH
}: CreateCategoryModalProps) {
    if (!isVisible) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* HEADER */}
                <h2 style={{ marginBottom: '1.5rem', margin: '0 0 1.5rem 0' }}>Crear nueva categoría</h2>

                {/* CONTENT - Scrolleable */}
                <form onSubmit={onSubmit} style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem' }}>
                    {isImageCropping ? (
                        <>
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => {
                                    setCrop(percentCrop);
                                }}
                                keepSelection
                                aspect={ASPECT_RATIO}
                                minWidth={MIN_WIDTH}
                            >
                                <img
                                    ref={imageRef}
                                    src={imageUrl}
                                    alt="Upload"
                                    style={{ maxHeight: '50vh', width: '100%', objectFit: 'contain' }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>

                            <canvas
                                ref={previewImageRef}
                                className="mt-4"
                                style={{
                                    display: 'none',
                                    border: '1px solid black',
                                    objectFit: 'contain',
                                    width: 150,
                                    height: 150
                                }}
                            />

                            <button
                                className="primary-button"
                                type="button"
                                style={{ marginTop: '16px', width: '100%' }}
                                onClick={() => {
                                    applyCrop((croppedFile: any, previewUrl: any) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            image: croppedFile,
                                            imagePreview: previewUrl
                                        }));
                                    });
                                }}
                            >
                                Aplicar Recorte
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-4" style={{ marginBottom: '20px', flexWrap: 'wrap' }}>
                                <div className="flex items-center aspect-[3/2] h-[176px]">
                                    <DropzoneWithPreview
                                        onFileChange={(file: File | null) => {
                                            if (file) onSelectFile(file);
                                        }}
                                        initialPreview={formData.imagePreview || imageUrl}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 justify-center h-full" style={{ flex: 1, minWidth: '200px' }}>
                                    <h2 style={{ marginBottom: '8px', fontWeight: '600' }}>Nombre</h2>
                                    <BorderTextField
                                        name="name"
                                        placeholder="Nombre de la categoría"
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        value={formData.name}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </form>

                {/* FOOTER - Botones */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#e5e7eb',
                            color: '#374151',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Cancelar
                    </button>
                    {!isImageCropping && (
                        <button
                            type="submit"
                            onClick={onSubmit}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#1e40af',
                                color: 'white',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            Guardar
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
