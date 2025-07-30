import { forwardRef } from 'react';
import styles from './FormInput.module.css'

interface FormInputProps {
    label?: string;
    labelClassName?: string;

    type: 'text' | 'email' | 'number' | 'date' | 'password';
    name?: string;
    id?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean; // For Disabling During Submission
    value?: string | number;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onFocus?: () => void;
    onBlur?: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    inputClassName?: string

    // For type: 'number':
    min?: string;
    max?: string;
    step?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
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
    onKeyDown,
    inputClassName
}, ref) => {

    const inputElement = (
        <input
            ref={ref}
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
            onKeyDown={onKeyDown}
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
})