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
                if (
                    imageElement.naturalWidth < MIN_DIMENSION ||
                    imageElement.naturalHeight < MIN_DIMENSION
                ) {
                    setError('La imagen es muy pequeña.');
                    setImageUrl('');
                    return;
                }
            };
            setImageUrl(resultUrl); // Base64 sin recortar
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

    const applyCrop = (onCropComplete: (file: File, preview: string) => void) => {
        if (!imageRef.current || !previewImageRef.current || !crop) return;

        setCanvasPreview(
            imageRef.current,
            previewImageRef.current,
            convertToPixelCrop(crop, imageRef.current.width, imageRef.current.height)
        );

        previewImageRef.current.toBlob((blob) => {
            if (blob) {
                const randomName = `cropped-image-${Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(3,16)}.png`;
                const file = new File([blob], randomName, { type: 'image/png' });
                const dataURL = previewImageRef.current!.toDataURL('image/png');
                onCropComplete(file, dataURL);
                setIsImageCropping(false);
            }
        }, 'image/png');
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
