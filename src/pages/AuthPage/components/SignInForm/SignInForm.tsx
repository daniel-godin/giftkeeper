import { FormEvent, useState } from 'react'
import styles from './SignInForm.module.css'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../firebase/firebase';
import { useNavigate } from 'react-router';
import { FormInput, FormSubmitButton } from '../../../../components/ui';

interface SignInFormData {
    email: string;
    password: string;
}

export function SignInForm () {
    const navigate = useNavigate();

    const [status, setStatus] = useState<string>('');
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
        setStatus('Signing in...');

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            setStatus('Successfully Signed In. Redirecting You...');
            setTimeout(() => {
                navigate('/dashboard');
                setIsSubmitting(false);
            }, 1000)
        } catch (error) {
            console.error('Error Signing In. Error:', error);
            setIsSubmitting(false);
            setStatus('Error Signing In');
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

            <output>{status}</output>

            <FormSubmitButton
                text='Sign In'
                isSubmitting={isSubmitting}
                submittingText='Signing In...'
                disabled={!formData.email.trim() || !formData.password.trim()}
            />
        </form>
    )
}