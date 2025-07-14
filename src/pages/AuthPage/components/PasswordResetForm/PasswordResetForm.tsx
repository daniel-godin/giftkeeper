import { FormEvent, useState } from 'react';
import styles from './PasswordResetForm.module.css'
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../../firebase/firebase';

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
            <label className={styles.label}>Email:
                <input
                    type='email'
                    name='email'
                    value={formData.email}
                    disabled={isSubmitting}
                    onChange={handleInputChange}
                    className={styles.input}
                />
            </label>

            <button type='submit' className={styles.button} disabled={isSubmitting}>Reset Password</button>

            {status && (<p className={styles.statusText}>{status}</p>)}
        </form>
    )
}