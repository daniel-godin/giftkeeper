import styles from './FormSelect.module.css'

interface Option {
    optionLabel: string;
    optionValue: string;
}

interface FormSelectProps {
    label?: string;
    labelClassName?: string;

    options?: Option[];

    name?: string;
    id?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean; // For Disabling During Submission
    value?: string | number;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
    onFocus?: () => void;
    onBlur?: () => void;
    inputClassName?: string
}

export function FormSelect({
    label,
    labelClassName,
    options = [],
    name,
    id,
    placeholder,
    required = false,
    disabled = false,
    value,
    onChange,
    onFocus,
    onBlur,
    inputClassName
} : FormSelectProps) {

    const selectElement = (
        <select
            name={name}
            id={id}
            required={required} // Default: false
            disabled={disabled} // Default: false
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            aria-required={required}
            className={`${styles.selectInput} ${inputClassName || ''}`}

        >
            {/* Optional "placeholder". Empty Value */}
            {placeholder && ( <option value='' className={styles.option}>{placeholder}</option>)}
                
            {options.map((option, index) => (
                <option
                    key={`${option.optionValue}-${index}`}
                    value={option.optionValue}
                    className={styles.option}
                >
                    {option.optionLabel}
                </option>
            ))}
        </select>
    )


    return label ? (
        <label className={`${styles.label} ${labelClassName || ''}`}>
            {label} {required && (<span className={styles.required}>*</span>)}
            {selectElement}
        </label>
    ) : (
        selectElement
    )
}