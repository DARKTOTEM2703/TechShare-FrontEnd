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
            className={`text-sm p-3 mb-4 border border-primary dark:border-gray-600 rounded-md w-full min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${readOnly ? 'bg-gray-50 dark:bg-gray-800' : ''} ${className || ''}`}
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
