import React from 'react';

interface TextFieldProps {
    placeholder: string;
    name: string;
    value: any;
    onChange: (e: any) => void;
    className?: string;
    isCurrency?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({ placeholder, name, value, onChange, className, isCurrency = false }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isCurrency) {
            const value = e.target.value.replace(/[^\d.]/g, '');
            
            const parts = value.split('.');
            if (parts.length > 2) return;
            
            const syntheticEvent = {
                ...e,
                target: {
                    ...e.target,
                    value: value
                }
            };
            
            onChange(syntheticEvent);
        } else {
            onChange(e);
        }
    };

    const formatCurrency = (value: any): string => {
        if (value === '' || value === null || isNaN(value)) return '$ ';
        return `$ ${value}`;
    };

    return (
        <input
            className={`text-sm p-[10px] mb-[15px] border-[1px] border-primary rounded-md ${className}`}
            placeholder={placeholder}
            type={isCurrency ? "text" : "text"}
            id={name}
            name={name}
            value={isCurrency ? formatCurrency(value) : value}
            onChange={handleChange}
            required
        />
    );
}

export default TextField;
