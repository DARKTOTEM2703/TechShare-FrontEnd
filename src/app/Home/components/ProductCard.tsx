import React from 'react';
import Image from 'next/image';

interface MaterialProps {
    material: {
        imagePath: string;
        name: string;
    };
}

const MaterialCard: React.FC<MaterialProps> = ({ material }) => {
    return (
        <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg bg-white shadow-md asd">
            <div className="w-full h-full flex items-center justify-center rounded-t-lg overflow-hidden">
                <Image
                    src={material.imagePath}
                    alt={material.name}
                    width={200}
                    height={150}
                    className="max-h-full max-w-full"
                />
            </div>
            <div className="my-3 text-md font-semibold text-gray-800 text-center ">
                {material.name}
            </div>
        </div>
    );
};

export default MaterialCard;
