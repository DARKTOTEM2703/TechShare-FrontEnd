"use client"
import React from 'react';
import { createPortal } from 'react-dom';
import BorderTextField from '@/components/Inputs/BorderTextField';
import DropzoneWithPreview from '@/components/DropZone';
import ReactCrop from 'react-image-crop';
import DynamicDropdown from '@/components/Dropdowns/DynamicDropdown';
import { Category } from '../../interfaces/Category';
import '@/styles/modal.css';

interface CreateSubCategoryModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: {
        name: string;
        image: File | null;
        imagePreview: string | null;
        idCategory: number;
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        name: string;
        image: File | null;
        imagePreview: string | null;
        idCategory: number;
    }>>;
    categories: Category[];
    isImageCropping: boolean;
    imageUrl: string;
    crop: any;
    setCrop: (crop: any) => void;
    imageRef: React.RefObject<HTMLImageElement>;
    previewImageRef: React.RefObject<HTMLCanvasElement>;
    onSelectFile: (file: File) => void;
    onImageLoad: any;
    applyCrop: (callback: (croppedFile: File, previewUrl: string) => void) => void;
    ASPECT_RATIO: number;
    MIN_WIDTH: number;
}

export default function CreateSubCategoryModal({
    isVisible,
    onClose,
    onSubmit,
    formData,
    setFormData,
    categories,
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
}: CreateSubCategoryModalProps) {
    if (!isVisible) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <form 
                onSubmit={onSubmit} 
                onClick={(e) => e.stopPropagation()}
                className="modal"
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                {/* Header */}
                <div className='border-b-[1px] mb-6'>
                    <h2 className='text-lg mb-2'>Añadir subcategoría</h2>
                </div>

                {/* Body - Scrolleable */}
                <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '16px' }}>
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
                                    style={{ maxHeight: '70vh' }}
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
                                Aplicar
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-2">
                                <div className="flex items-center aspect-[3/2] h-[176px] mr-5">
                                    <DropzoneWithPreview
                                        onFileChange={(file: File | null) => {
                                            if (file) onSelectFile(file);
                                        }}
                                        initialPreview={formData.imagePreview || imageUrl}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <h2>Nombre</h2>
                                    <BorderTextField
                                        name="name"
                                        placeholder="Nombre de la subcategoría"
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        value={formData.name}
                                    />
                                    <h2>Categoría</h2>
                                    <DynamicDropdown
                                        data={categories}
                                        valueKey="categoryId"
                                        labelKey="name"
                                        selectedValue={formData.idCategory}
                                        onChange={(value: number) => setFormData({ ...formData, idCategory: value })}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer - Botones */}
                <div className='flex justify-end space-x-3 mt-4'>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#f0f0f0',
                            color: '#1e2a5e',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Cancelar
                    </button>
                    {!isImageCropping && (
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#1e2a5e',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            Guardar
                        </button>
                    )}
                </div>
            </form>
        </div>,
        document.body
    );
}
