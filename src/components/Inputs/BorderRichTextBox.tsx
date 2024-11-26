import React from 'react';

interface TextFieldProps {
    placeholder: string;
    name: string;
    value: string;
    onChange: (e: any) => void;
    className?: string;
}

const TextField: React.FC<TextFieldProps> = ({ placeholder, name, value, onChange, className }) => {
    return (
        <textarea
            className={`text-sm p-3 mb-4 border border-primary rounded-md w-full min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary ${className || ''}`}
            placeholder={placeholder}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={3} // Opcional: filas iniciales visibles
            required
        />
    );
};

export default TextField;
