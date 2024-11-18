import React from 'react';

interface DynamicDropdownProps<T> {
    data: T[];
    valueKey: keyof T;
    labelKey: keyof T;
    selectedValue: T[keyof T];
    onChange: (value: T[keyof T]) => void;
    placeholder?: string;
}

const DynamicDropdown = <T,>({
    data,
    valueKey,
    labelKey,
    selectedValue,
    onChange,
    placeholder = "Select an option",
}: DynamicDropdownProps<T>) => {
    return (
        <select
            value={Number(selectedValue) || ""}
            onChange={(e) => onChange(e.target.value as T[keyof T])}
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
