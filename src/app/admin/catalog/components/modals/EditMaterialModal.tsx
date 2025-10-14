import React from 'react';
import ModalBase from '@/components/Modal/ModalBase';
import BorderTextField from '@/components/Inputs/BorderTextField';
import RichTextBox from '@/components/Inputs/BorderRichTextBox';
import DropzoneWithPreview from '@/components/DropZone';
import ReactCrop from 'react-image-crop';
import AsyncSelect from 'react-select/async';

interface EditMaterialModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: any;
    setFormData: any;
    subCategories: any[];

    roleOptions: any[];
    loadRoleOptions: (inputValue: string, callback: (options: any[]) => void) => void;
    selectedMaterial: any;
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

export default function EditMaterialModal({
    isVisible,
    onClose,
    onSubmit,
    formData,
    setFormData,
    subCategories,
    roleOptions,
    loadRoleOptions,
    selectedMaterial,
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
}: EditMaterialModalProps) {
    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <ModalBase
                    onClose={onClose}
                    header="Editar material"
                    onSubmit={onSubmit}
                    showButtons={!isImageCropping}
                >
                    {isImageCropping ? (
                        <>
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
                                    applyCrop((croppedFile, previewUrl) => {
                                        setFormData((prev: any) => ({
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
                                        initialPreview={formData.imagePreview || selectedMaterial?.imagePath || ''}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h2>Nombre</h2>
                                    <BorderTextField
                                        name="name"
                                        placeholder="Nombre del material"
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        value={formData.name}
                                    />
                                    <h2>Precio</h2>
                                    <BorderTextField
                                        name="price"
                                        placeholder="Precio del material"
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        value={formData.price}
                                        isCurrency={true}
                                    />
                                </div>
                            </div>
                            <h2>Descripción</h2>
                            <RichTextBox
                                name="description"
                                placeholder="Añade una descripción para el material"
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                value={formData.description}
                            />
                            <h2>Subcategoría</h2>
                            <AsyncSelect
                                className='border rounded-md border-primary mb-4'
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
                            <h2>Roles</h2>
                            <AsyncSelect
                                className='border rounded-md border-primary mb-4'
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
                        </>
                    )}
                </ModalBase>
            </div>
        </div>
    );
}
