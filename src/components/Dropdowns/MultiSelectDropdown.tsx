interface MultiSelectDropdownProps<T> {
    data: T[];
    valueKey: keyof T;
    labelKey: keyof T;
    selectedValues: T[keyof T][];
    onChange: (values: T[keyof T][]) => void;
}

const MultiSelectDropdown = <T,>({
    data,
    valueKey,
    labelKey,
    selectedValues,
    onChange,
}: MultiSelectDropdownProps<T>) => {
    const handleCheckboxChange = (value: T[keyof T]) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter((v) => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    return (
        <div>
            {data.map((item, index) => (
                <div key={index}>
                    <label>
                        <input
                            type="checkbox"
                            value={item[valueKey] as string}
                            checked={selectedValues.includes(item[valueKey])}
                            onChange={() => handleCheckboxChange(item[valueKey])}
                        />
                        {String(item[labelKey])}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default MultiSelectDropdown;
