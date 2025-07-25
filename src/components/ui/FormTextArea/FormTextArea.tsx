import styles from './FormTextArea.module.css'

interface FormTextAreaProps {
    label?: string;
    labelClassName?: string;

    name?: string;
    id?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean; // For Disabling During Submission
    value?: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    onFocus?: () => void;
    onBlur?: () => void;
    inputClassName?: string

    // For type: 'textarea':
    rows?: number;
}

export function FormTextArea({
    label,
    labelClassName,
    name,
    id,
    placeholder,
    required = false,
    disabled = false,
    value,
    onChange,
    onFocus,
    onBlur,
    inputClassName,
    rows = 4
} : FormTextAreaProps) {

    const textAreaElement = (
        <textarea
            name={name}
            id={id}
            placeholder={placeholder}
            required={required} // Default: false
            disabled={disabled} // Default: false
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            aria-required={required}
            className={`${styles.textarea} ${inputClassName || ''}`}
            rows={rows}
        />
    )

    // if (label): Render both <label> AND <textarea>, otherwise render just <textarea>
    return label ? (
        <label className={`${styles.label} ${labelClassName || ''}`}>
            {label} {required && (<span className={styles.required}>*</span>)}
            {textAreaElement}
        </label>
    ) : (
        textAreaElement
    )
}