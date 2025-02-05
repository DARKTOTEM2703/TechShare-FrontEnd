import React from 'react';
import ModalBase from '@/components/Modal/ModalBase';
import BorderTextField from '@/components/Inputs/BorderTextField';
import DropzoneWithPreview from '@/components/DropZone';
import ReactCrop from 'react-image-crop';
import { Category } from '../../interfaces/Category';

interface EditCategoryModalProps {
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
    onSelectFile: (file: File) => void;
    onImageLoad: any;
    applyCrop: (callback: (croppedFile: File, previewUrl: string) => void) => void;
    selectedCategory: Category | null;
    ASPECT_RATIO: number;
    MIN_WIDTH: number;
}

export default function EditCategoryModal({
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
    selectedCategory,
    ASPECT_RATIO,
    MIN_WIDTH
}: EditCategoryModalProps) {
    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <ModalBase
                    onClose={onClose}
                    header="Editar categoría"
                    onSubmit={onSubmit}
                >
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
                                        initialPreview={formData.imagePreview ||
                                            selectedCategory?.imagePath ||
                                            ''}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 justify-center h-full">
                                    <h2>Nombre</h2>
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
                </ModalBase>
            </div>
        </div>
    );
}
