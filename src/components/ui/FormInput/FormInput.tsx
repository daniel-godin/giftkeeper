import styles from './FormInput.module.css'

interface FormInputProps {
    label?: string;
    labelClassName?: string;

    type?: 'text' | 'email' | 'number' | 'date';
    name?: string;
    id?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean; // For Disabling During Submission
    value?: string | number;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onFocus?: () => void;
    onBlur?: () => void;
    inputClassName?: string

    // For type: 'number':
    min?: string;
    max?: string;
    step?: string;
}

export function FormInput({
    label,
    labelClassName,
    type = 'text',
    name,
    id,
    placeholder,
    required = false,
    disabled = false,
    min,
    max,
    step,
    value,
    onChange,
    onFocus,
    onBlur,
    inputClassName
} : FormInputProps) {

    const inputElement = (
        <input
            type={type} // Default: 'text'
            name={name}
            id={id}
            placeholder={placeholder}
            required={required} // Default: false
            disabled={disabled} // Default: false
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            aria-required={required}
            className={`${styles.input} ${inputClassName || ''}`}
        />
    )

    // If (label): Render both <label> AND <input>, otherwise, just <input>
    return label ? (
        <label className={`${styles.label} ${labelClassName || ''}`}>
            {label} {required && (<span className={styles.required}>*</span>)}
            {inputElement}
        </label>
    ) : (
        inputElement
    )
}