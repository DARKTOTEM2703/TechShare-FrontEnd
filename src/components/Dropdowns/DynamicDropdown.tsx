import React from 'react';

interface DynamicDropdownProps<T> {
    data: T[];
    valueKey: keyof T;
    labelKey: keyof T;
    selectedValue: T[keyof T];
    onChange: any;
    placeholder?: string;
    className?: string;
}

const DynamicDropdown = <T,>({
    data,
    valueKey,
    labelKey,
    selectedValue,
    onChange,
    placeholder = "Selecciona una opción",
    className,
}: DynamicDropdownProps<T>) => {
    return (
        <select
            value={Number(selectedValue) || ""}
            onChange={(e) => onChange(e.target.value as T[keyof T])}
            required
            className={`text-sm p-[10px] mb-[15px] border-[1px] border-primary rounded-md ${className}`}
        >
            <option value="" disabled>
                {placeholder}
            </option>
            {data.map((item, index) => (
                <option key={index} value={item[valueKey] as string}>
                    {String(item[labelKey])}
                </option>
            ))}
        </select>
    );
};

export default DynamicDropdown;
