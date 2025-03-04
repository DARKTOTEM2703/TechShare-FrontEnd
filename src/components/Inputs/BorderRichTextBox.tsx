import React from 'react';

interface TextFieldProps {
    placeholder: string;
    name: string;
    value: string;
    onChange: (e: any) => void;
    className?: string;
    readOnly?: boolean;
    required?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({ 
    placeholder, 
    name, 
    value, 
    onChange, 
    className,
    readOnly = false,
    required = false
}) => {
    return (
        <textarea
            className={`text-sm p-3 mb-4 border border-primary rounded-md w-full min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary ${readOnly ? 'bg-gray-50' : ''} ${className || ''}`}
            placeholder={placeholder}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={3} // Opcional: filas iniciales visibles
            readOnly={readOnly}
            required={required}
        />
    );
};

export default TextField;
