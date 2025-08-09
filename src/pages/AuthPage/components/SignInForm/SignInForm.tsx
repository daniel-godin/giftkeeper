import { FormEvent, useState } from 'react'
import styles from './SignInForm.module.css'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../firebase/firebase';
import { useNavigate } from 'react-router';
import { FormInput, FormSubmitButton } from '../../../../components/ui';
import { useToast } from '../../../../contexts/ToastContext';

interface SignInFormData {
    email: string;
    password: string;
}

export function SignInForm () {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [formData, setFormData] = useState<SignInFormData>({email: '', password: ''});
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

        setIsSubmitting(true);
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);

            addToast({
                type: 'success',
                title: 'Success!',
                message: "Successfully logged in. Redirecting you now."
            })
            setTimeout(() => { navigate('/dashboard'); }, 1000);
        } catch (error) {

            interface FirebaseError extends Error {
                code?: string;
            }

            let firebaseError = error as FirebaseError;

            let toastMessage = 'Error signing in.  Please try again.';

            switch (firebaseError.code) {
                case 'auth/invalid-credential':
                    toastMessage = 'Invalid email or password.'
                    break
                case 'auth/user-disabled':
                    toastMessage = 'This account has been disabled. Contact support.'
                    break
                case 'auth/too-many-requests':
                    toastMessage = 'Too many failed attempts. Please try again in a few minutes.'
                    break
                case 'auth/network-request-failed':
                    toastMessage = 'Connection error. Please check your internet and try again.'
                    break
            }

            addToast({
                type: 'error',
                title: 'Failure To Sign In',
                message: toastMessage,
                error: error as Error,
            })
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form className={styles.signInForm} onSubmit={handleSubmit}>

            {/* Sign In Email: */}
            <FormInput
                label='Email:'
                type='email'
                name='email'
                required={true}
                disabled={isSubmitting}
                value={formData.email}
                onChange={handleInputChange}
            />

            {/* Sign In Password: */}
            <FormInput
                label='Password:'
                type='password'
                name='password'
                required={true}
                disabled={isSubmitting}
                value={formData.password}
                onChange={handleInputChange}
            />

            <FormSubmitButton
                text='Sign In'
                isSubmitting={isSubmitting}
                submittingText='Signing In...'
                disabled={!formData.email.trim() || !formData.password.trim()}
            />
        </form>
    )
}