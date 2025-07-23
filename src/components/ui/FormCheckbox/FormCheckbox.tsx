import styles from './FormCheckbox.module.css'

interface FormCheckboxProps {
    label?: string;
    labelClassName?: string;
    name?: string;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    checked: boolean;
    onChange: (checked: boolean) => void;
    inputClassName?: string;
}

export function FormCheckbox({
    label,
    labelClassName,
    name,
    id,
    required = false,
    disabled = false,
    checked,
    onChange,
    inputClassName
} : FormCheckboxProps) {

    const checkboxElement = (
        <input
            type='checkbox'
            name={name}
            id={id}
            required={required}
            disabled={disabled}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-required={required}
            className={`${styles.input} ${inputClassName || ''}`}
        />
    )

    return label ? (
        <label className={`${styles.label} ${labelClassName || ''}`}>
            {checkboxElement}
            {label}
        </label>
    ) : (
        checkboxElement
    )
}