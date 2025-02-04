import { useRef, useState } from 'react';
import { centerCrop, convertToPixelCrop, makeAspectCrop, Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import setCanvasPreview from '@/utils/setCanvasPreview';

interface ImageCrop {
    ASPECT_RATIO: number;
    MIN_DIMENSION: number;
    MIN_WIDTH: number;
}

export const useImageCrop = ({ASPECT_RATIO, MIN_DIMENSION} : ImageCrop) => {
    const [imageUrl, setImageUrl] = useState<string>(''); // URL base64 de la imagen sin recortar
    const [crop, setCrop] = useState<Crop>();
    const [error, setError] = useState<string | null>(null);
    const [isImageCropping, setIsImageCropping] = useState(false);

    const imageRef = useRef<HTMLImageElement | null>(null);
    const previewImageRef = useRef<HTMLCanvasElement | null>(null);

    const onSelectFile = (file: File | null) => {
        if (!file) return;
        setIsImageCropping(true);

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const resultUrl = reader.result?.toString() || '';
            const imageElement = new Image();
            imageElement.src = resultUrl;
            imageElement.onload = () => {
                /*
    if (
        imageElement.naturalWidth < MIN_DIMENSION ||
        imageElement.naturalHeight < MIN_DIMENSION
    ) {
        setError('La imagen es muy pequeña.');
        setImageUrl('');
        return;
    }*/
    const resizedImage = resizeImage(imageElement, 720, 720); // Ejemplo de 1024px máx.
    setImageUrl(resizedImage); // Base64 optimizada
};

        });
        reader.readAsDataURL(file);
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

        const initialCrop = makeAspectCrop(
            { unit: '%', width: cropWidthInPercent },
            ASPECT_RATIO,
            width,
            height
        );

        const centeredCrop = centerCrop(initialCrop, width, height);
        setCrop(centeredCrop);
    };

    const resizeImage = (image: HTMLImageElement, maxWidth: number, maxHeight: number) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let width = image.naturalWidth;
    let height = image.naturalHeight;

    if (width > maxWidth || height > maxHeight) {
        if (width > height) {
            height = (height / width) * maxWidth;
            width = maxWidth;
        } else {
            width = (width / height) * maxHeight;
            height = maxHeight;
        }
    }

    canvas.width = width;
    canvas.height = height;
    ctx?.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.4); // Ajusta el 0.8 para cambiar la calidad
};


    const applyCrop = (onCropComplete: (file: File, preview: string) => void) => {
        if (!imageRef.current || !previewImageRef.current || !crop) return;

        setCanvasPreview(
            imageRef.current,
            previewImageRef.current,
            convertToPixelCrop(crop, imageRef.current.width, imageRef.current.height)
        );

        previewImageRef.current.toBlob(
    (blob) => {
        if (blob) {
            const randomName = `cropped-image-${Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(3,16)}.jpg`;
            const file = new File([blob], randomName, { type: 'image/jpg' });
            const dataURL = previewImageRef.current!.toDataURL('image/jpg', 0.4); // Calidad 70%
            onCropComplete(file, dataURL);
            setIsImageCropping(false);
        }
    },
    'image/jpg',
    0.4 // Calidad de la imagen comprimida
);
    };

    return {
        imageUrl,
        setImageUrl,
        crop,
        applyCrop,
        setCrop,
        imageRef,
        previewImageRef,
        isImageCropping,
        onSelectFile,
        onImageLoad,
        setIsImageCropping
    };
};
