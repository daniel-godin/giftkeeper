import { FormEvent, useState } from 'react';
import styles from './PasswordResetForm.module.css'
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../../firebase/firebase';
import { FormInput, FormSubmitButton } from '../../../../components/ui';

interface PasswordResetFormData {
    email: string;
}

export function PasswordResetForm() {

    const [status, setStatus] = useState<string>('');
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

        setStatus('Resetting Password...');
        setIsSubmitting(true);
        try {
            await sendPasswordResetEmail(auth, formData.email);

            setStatus('Email Sent.  Check your email to reset your password.')

            setTimeout(() => { // 30s Timeout to prevent abuse.
                setIsSubmitting(false)
            }, 30000) 
        } catch (error) {
            console.error('Error sending password reset email. Error:', error);
            setStatus('Error sending password reset email. Please try again.');
            setIsSubmitting(false);
        }
    }

    return (
        <form className={styles.passwordResetForm} onSubmit={handleSubmit}>
            <h2 className={styles.formHeader}>Reset Password</h2>

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

            <output>{status}</output>

            <FormSubmitButton
                text='Reset Password'
                isSubmitting={isSubmitting}
                submittingText='Resetting Password (check your email)...'
                disabled={!formData.email.trim()}
            />
        </form>
    )
}