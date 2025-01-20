import React, { useRef, useState } from 'react';
import CrudHeader from '@/components/AdminCrud/CrudHeader';
import CrudBody from '@/components/AdminCrud/CrudBodyWithImages';
import ModalBase from '@/components/Modal/ModalBase';
import BorderTextField from '@/components/Inputs/BorderTextField';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import endpoints from '@/app/infraestructure/config/configAPI';
import DropzoneWithPreview from '@/components/DropZone';
import ReactCrop, {
    centerCrop,
    convertToPixelCrop,
    makeAspectCrop
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; // Importa los estilos de ReactCrop
import setCanvasPreview from '@/utils/setCanvasPreview.js';

export default function Categories({
    token,
    categories,
    refreshCategories
}: {
    token: any;
    categories: any;
    refreshCategories: any;
}) {
    const { setClickedItemId, handleCreate, handleUpdate, handleDelete, clickedItemId } =
        useCrudOperations(token, refreshCategories);

    // Agregamos imagePreview (string) para mostrar en el Dropzone
    const [formData, setFormData] = useState<{
        name: string;
        image: File | null;
        imagePreview: string | null; // <- DataURL para previsualizar
    }>({
        name: '',
        image: null,
        imagePreview: null
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [isImageCropping, setIsImageCropping] = useState(false);

    // Mostrar/Cerrar modal de creación
    const showCreateModal = () => setCreateModalVisible(true);
    const hideCreateModal = () => {
        setCreateModalVisible(false);
        setFormData({ name: '', image: null, imagePreview: null });
        setIsImageCropping(false);
        setImageUrl('');
        setCrop(undefined);
    };

    // Mostrar/Cerrar modal de edición
    const showEditModal = (id: number) => {
        const selectedCategory = categories.find(
            (category: any) => category.categoryId === id
        );
        setSelectedCategory(selectedCategory);
        if (selectedCategory) {
            setClickedItemId(id);
            setFormData({
                name: selectedCategory.name,
                image: null,
                // Si el backend te da una URL, úsala como preview inicial
                imagePreview: selectedCategory.imageUrl || null
            });
            setEditModalVisible(true);
        }
    };

    const hideEditModal = () => {
        setEditModalVisible(false);
        setFormData({ name: '', image: null, imagePreview: null });
    };

    // Mostrar/Cerrar modal de eliminación
    const showDeleteModal = (id: number) => {
        setClickedItemId(id);
        setDeleteModalVisible(true);
    };
    const hideDeleteModal = () => setDeleteModalVisible(false);

    // Crear nueva categoría
    const handleCreateCategory = (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);

        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        handleCreate(endpoints.categories.create, formDataToSend);
        hideCreateModal();
    };

    // Actualizar categoría existente
    const handleEditCategory = (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);

        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        if (clickedItemId !== null) {
            handleUpdate(endpoints.categories.update(clickedItemId), formDataToSend);
        }
        hideEditModal();
    };

    // Eliminar categoría
    const handleDeleteCategory = () => {
        if (clickedItemId !== null) {
            handleDelete(endpoints.categories.delete(clickedItemId));
        }
        hideDeleteModal();
    };

    const handleSearchChange = (value: string) => setSearchTerm(value);

    // Lógica de recorte
    const [imageUrl, setImageUrl] = useState<string>(''); // URL base64 de la imagen sin recortar
    const [crop, setCrop] = useState<any>();
    const [error, setError] = useState<any>();

    const imageRef = useRef<HTMLImageElement | null>(null);
    const previewImageRef = useRef<HTMLCanvasElement | null>(null);

    const ASPECT_RATIO = 1;
    const MIN_WIDTH = 100;
    const MIN_DIMENSION = 100;

    // Cuando el usuario selecciona el archivo en el Dropzone
    const onSelectFile = (file: File | null) => {
        if (!file) return;
        setIsImageCropping(true);

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const resultUrl = reader.result?.toString() || '';
            const imageElement = new Image();
            imageElement.src = resultUrl;
            imageElement.addEventListener('load', () => {
                // Valida dimensiones mínimas
                if (
                    imageElement.naturalWidth < MIN_DIMENSION ||
                    imageElement.naturalHeight < MIN_DIMENSION
                ) {
                    setError('La imagen es muy pequeña.');
                    setImageUrl('');
                    return;
                }
            });
            setImageUrl(resultUrl); // Base64 sin recortar
        });
        reader.readAsDataURL(file);
    };

    // Calcula el recorte inicial (al cargar la imagen en ReactCrop)
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

        const initialCrop = makeAspectCrop(
            {
                unit: '%',
                width: cropWidthInPercent
            },
            ASPECT_RATIO,
            width,
            height
        );

        const centeredCrop = centerCrop(initialCrop, width, height);
        setCrop(centeredCrop);
    };

    return (
        <div>
            <CrudHeader
                title="Categories"
                dropdownOptions={[]}
                buttonLabel="Add Category"
                buttonFunction={showCreateModal}
                onSearchChange={handleSearchChange}
            />
            <CrudBody
                data={categories}
                searchTerm={searchTerm}
                onDelete={(id) => showDeleteModal(id)}
                onEdit={(id) => showEditModal(id)}
            />

            {/* Modal de Creación */}
            {isCreateModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase
                            onClose={hideCreateModal}
                            header="Create New Category"
                            onSubmit={handleCreateCategory}
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
                                        {/* Imagen a recortar */}
                                        <img
                                            ref={imageRef}
                                            src={imageUrl}
                                            alt="Upload"
                                            style={{ maxHeight: '70vh' }}
                                            onLoad={onImageLoad}
                                        />
                                    </ReactCrop>

                                    {/* Canvas oculto donde dibujamos la imagen recortada */}
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
                                            if (!imageRef.current || !previewImageRef.current) return;

                                            // 1) Dibujamos la porción recortada en el canvas
                                            setCanvasPreview(
                                                imageRef.current,
                                                previewImageRef.current,
                                                convertToPixelCrop(
                                                    crop,
                                                    imageRef.current.width,
                                                    imageRef.current.height
                                                )
                                            );

                                            // 2) Convertimos el contenido del canvas en Blob
                                            previewImageRef.current.toBlob(
                                                (blob) => {
                                                    if (blob) {
                                                        // 3) Creamos un File a partir de ese blob
                                                        const file = new File([blob], 'cropped-image.png', {
                                                            type: 'image/png'
                                                        });

                                                        // 4) Generamos un dataURL para previsualizar en el Dropzone
                                                        const dataURL = previewImageRef.current?.toDataURL('image/png');

                                                        // 5) Actualizamos el estado para envío (File) y para vista (dataURL)
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            image: file,
                                                            imagePreview: dataURL || null
                                                        }));

                                                        // 6) Ocultamos la vista de recorte
                                                        setIsImageCropping(false);
                                                    }
                                                },
                                                'image/png'
                                            );
                                        }}
                                    >
                                        Aplicar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <BorderTextField
                                        name="name"
                                        placeholder="Category Name"
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        value={formData.name}
                                    />

                                    {/* 
                                      Aquí en initialPreview:
                                      - Si ya recortaste, muestra formData.imagePreview
                                      - Si aún no, muestra imageUrl (la imagen subida sin recortar)
                                    */}
                                    <DropzoneWithPreview
                                        onFileChange={(file) => onSelectFile(file)}
                                        initialPreview={formData.imagePreview || imageUrl}
                                    />
                                </>
                            )}
                        </ModalBase>
                    </div>
                </div>
            )}

            {/* Modal de Edición */}
            {isEditModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase
                            onClose={hideEditModal}
                            header="Edit Category"
                            onSubmit={handleEditCategory}
                        >
                            <BorderTextField
                                name="name"
                                placeholder="Category Name"
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                value={formData.name}
                            />
                            <DropzoneWithPreview
                                onFileChange={(file) => setFormData({ ...formData, image: file })}
                                // Usa la imagen del backend o la de formData si se ha recortado
                                initialPreview={
                                    formData.imagePreview ||
                                    selectedCategory?.imagePath ||
                                    ''
                                }
                            />
                        </ModalBase>
                    </div>
                </div>
            )}

            {/* Modal de Eliminación */}
            {isDeleteModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase
                            onClose={hideDeleteModal}
                            header="Confirm Delete Category"
                            onSubmit={handleDeleteCategory}
                        >
                            <p>Are you sure you want to delete this category?</p>
                        </ModalBase>
                    </div>
                </div>
            )}
        </div>
    );
}
