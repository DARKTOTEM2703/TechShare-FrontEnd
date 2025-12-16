"use client"
import React from 'react';
import { createPortal } from 'react-dom';
import BorderTextField from '@/components/Inputs/BorderTextField';
import RichTextBox from '@/components/Inputs/BorderRichTextBox';
import DropzoneWithPreview from '@/components/DropZone';
import ReactCrop from 'react-image-crop';
import AsyncSelect from 'react-select/async';
import '@/styles/modal.css';

interface CreateMaterialModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: any;
    setFormData: any;
    subCategories: any[];
    roleOptions: any[];
    loadRoleOptions: (inputValue: string, callback: (options: any[]) => void) => void;
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

export default function CreateMaterialModal({
    isVisible,
    onClose,
    onSubmit,
    formData,
    setFormData,
    subCategories,
    roleOptions,
    loadRoleOptions,
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
}: CreateMaterialModalProps) {
    if (!isVisible) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* HEADER */}
                <h2 style={{ marginBottom: '1.5rem', margin: '0 0 1.5rem 0' }}>Nuevo material</h2>

                {/* CONTENT - Scrolleable */}
                <form onSubmit={onSubmit} style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem' }}>
                    {isImageCropping ? (
                        <div style={{ textAlign: 'center' }}>
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
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
                            <div className="flex gap-4" style={{ marginBottom: '20px' }}>
                                <div className="flex items-center aspect-[3/2] h-[176px]">
                                    <DropzoneWithPreview
                                        onFileChange={(file: File | null) => {
                                            if (file) onSelectFile(file);
                                        }}
                                        initialPreview={formData.imagePreview || ''}
                                    />
                                </div>

                                <div className="flex flex-col gap-4" style={{ flex: 1 }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nombre</label>
                                        <BorderTextField
                                            name="name"
                                            placeholder="Nombre del material"
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            value={formData.name}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Precio</label>
                                            <BorderTextField
                                                name="price"
                                                placeholder="$ 0"
                                                onChange={(e) =>
                                                    setFormData({ ...formData, price: e.target.value })
                                                }
                                                value={formData.price}
                                                isCurrency={true}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Stock Inicial</label>
                                            <BorderTextField
                                                name="initialStock"
                                                placeholder="0"
                                                onChange={(e) =>
                                                    setFormData({ ...formData, initialStock: e.target.value })
                                                }
                                                value={formData.initialStock}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Descripción</label>
                                <RichTextBox
                                    name="description"
                                    placeholder="Añade una descripción para el material"
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    value={formData.description}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Subcategoría</label>
                                <AsyncSelect
                                    className='border rounded-md border-primary'
                                    cacheOptions
                                    defaultOptions={(Array.isArray(subCategories) ? subCategories : []).map(sub => ({
                                        value: sub.subCategoriesId,
                                        label: sub.name
                                    }))}
                                    value={(Array.isArray(subCategories) ? subCategories : [])
                                        .filter(sub => sub.subCategoriesId === formData.subCategoryId)
                                        .map(sub => ({
                                            value: sub.subCategoriesId,
                                            label: sub.name
                                        }))[0]}
                                    onChange={(selectedOption: any) =>
                                        setFormData({ ...formData, subCategoryId: selectedOption.value })
                                    }
                                    placeholder="Selecciona una subcategoría"
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Roles</label>
                                <AsyncSelect
                                    className='border rounded-md border-primary'
                                    cacheOptions
                                    defaultOptions={roleOptions}
                                    loadOptions={loadRoleOptions}
                                    isMulti
                                    placeholder="Selecciona los roles"
                                    value={roleOptions.filter((role: any) => formData.roleIds.includes(role.value))}
                                    onChange={(selectedOptions) =>
                                        setFormData({
                                            ...formData,
                                            roleIds: selectedOptions.map((option: any) => option.value),
                                        })
                                    }
                                />
                            </div>
                        </>
                    )}
                </form>

                {/* FOOTER - Botones */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    {isImageCropping ? (
                        <button
                            type="button"
                            onClick={() => {
                                applyCrop((croppedFile, previewUrl) => {
                                    setFormData((prev: any) => ({
                                        ...prev,
                                        image: croppedFile,
                                        imagePreview: previewUrl
                                    }));
                                });
                            }}
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
                            Aplicar
                        </button>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
