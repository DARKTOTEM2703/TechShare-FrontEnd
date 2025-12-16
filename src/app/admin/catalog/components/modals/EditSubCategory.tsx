"use client"
import React from 'react';
import { createPortal } from 'react-dom';
import '@/styles/modal.css';
import BorderTextField from '@/components/Inputs/BorderTextField';
import DropzoneWithPreview from '@/components/DropZone';
import ReactCrop from 'react-image-crop';
import DynamicDropdown from '@/components/Dropdowns/DynamicDropdown';
import { Category } from '../../interfaces/Category';

interface EditSubCategoryModalProps {
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
    selectedSubCategory: any;
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

export default function EditSubCategoryModal({
    isVisible,
    onClose,
    onSubmit,
    formData,
    setFormData,
    categories,
    selectedSubCategory,
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
}: EditSubCategoryModalProps) {
    if (!isVisible) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <form className="modal" onSubmit={onSubmit} onClick={(e) => e.stopPropagation()} style={{display: 'flex', flexDirection: 'column', maxHeight: '90vh'}}>
                {/* HEADER */}
                <div className="modal-header" style={{flexShrink: 0}}>
                    <h2>Editar subcategoría</h2>
                    <button type="button" className="close-button" onClick={onClose}>×</button>
                </div>

                {/* BODY - Scrolleable */}
                <div className="modal-body" style={{flexGrow: 1, overflowY: 'auto', padding: '1.5rem'}}>
                    {isImageCropping ? (
                        <div style={{textAlign: 'center'}}>
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
                        </div>
                    ) : (
                        <>
                            <div className="flex gap-2">
                                <div className="flex items-center aspect-[3/2] h-[176px] mr-5">
                                    <DropzoneWithPreview
                                        onFileChange={(file: File | null) => {
                                            if (file) onSelectFile(file);
                                        }}
                                        initialPreview={formData.imagePreview || selectedSubCategory?.imagePath || ''}
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

                {/* FOOTER - Fixed */}
                <div className="modal-footer" style={{flexShrink: 0, padding: '1rem 1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem'}}>
                    {isImageCropping ? (
                        <button
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
                            style={{
                                padding: '0.625rem 1.25rem',
                                backgroundColor: '#1e40af',
                                color: 'white',
                                borderRadius: '0.5rem',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                            }}
                        >
                            Aplicar
                        </button>
                    ) : (
                        <>
                            <button 
                                type="button" 
                                onClick={onClose}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    backgroundColor: '#e5e7eb',
                                    color: '#374151',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '500'
                                }}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    backgroundColor: '#1e40af',
                                    color: 'white',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '500'
                                }}
                            >
                                Guardar
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>,
        document.body
    );
}
