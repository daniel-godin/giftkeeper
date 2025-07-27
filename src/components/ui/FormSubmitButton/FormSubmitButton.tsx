import styles from './FormSubmitButton.module.css'

interface FormSubmitButtonProps {
    text: string;
    isSubmitting?: boolean;
    submittingText?: string;
    disabled?: boolean;
    buttonClassName?: string;
}

export function FormSubmitButton({
    text,
    isSubmitting = false,
    submittingText,
    disabled = false,
    buttonClassName
} : FormSubmitButtonProps) {

    return (
        <button
            type='submit'
            disabled={disabled || isSubmitting}
            className={`${styles.submitButton} ${buttonClassName || ''}`}
        >
            {isSubmitting && submittingText ? submittingText : text}
        </button>
    )
}