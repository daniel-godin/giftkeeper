import { FormEvent, useState } from 'react';
import styles from './PasswordResetForm.module.css'
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../../firebase/firebase';
import { FormInput, FormSubmitButton } from '../../../../components/ui';
import { useToast } from '../../../../contexts/ToastContext';
import { devError } from '../../../../utils/logger';

interface PasswordResetFormData {
    email: string;
}

export function PasswordResetForm() {
    const { addToast } = useToast();

    const [formData, setFormData] = useState<PasswordResetFormData>({ email: '' });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.email) { return }; // Guard Clause

        setIsSubmitting(true);
        try {
            await sendPasswordResetEmail(auth, formData.email);

            addToast({
                type: 'success',
                title: 'Password Reset',
                message: 'Password reset, please check your email.'
            })

        } catch (error) {
            devError('Error sending password reset email. Error:', error)

            addToast({
                type: 'error',
                title: 'Error Resetting Password',
                message: 'There was an error resetting your password. Please try again.',
                error: error as Error,
                duration: 10000
            })

        } finally {
            setTimeout(() => { // 10s Timeout to prevent abuse.
                setIsSubmitting(false)
            }, 10000);
        }
    }

    return (
        <form className={styles.passwordResetForm} onSubmit={handleSubmit}>

            {/* Reset Password Email: */}
            <FormInput
                label='Email:'
                type='email'
                name='email'
                required={true}
                disabled={isSubmitting}
                value={formData.email}
                onChange={handleInputChange}
            />

            <FormSubmitButton
                text='Reset Password'
                isSubmitting={isSubmitting}
                submittingText='Resetting Password (check your email)...'
                disabled={!formData.email.trim()}
            />

        </form>
    )
}