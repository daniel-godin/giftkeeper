import { FormEvent, useState } from 'react'
import styles from './SignInForm.module.css'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../firebase/firebase';
import { useNavigate } from 'react-router';

interface SignInFormData {
    email: string;
    password: string;
}

export function SignInForm () {
    const navigate = useNavigate();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<SignInFormData>({email: '', password: ''});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setStatus('Signing in...');
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            setStatus('Successfully Signed In. Redirecting You...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500)
        } catch (error) {
            console.error('Error Signing In. Error:', error);
            setStatus('Error Signing In');
        }
    }

    return (
        <form className={styles.signInForm} onSubmit={handleSubmit}>
            <h2 className={styles.formHeader}>Sign In</h2>
            <label className={styles.label}>Email:
                <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                />
            </label>
            <label className={styles.label}>Password:
                <input
                    type='password'
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    className={styles.input}
                />
            </label>

            <button className={styles.button}>Sign In</button>

            {status && (<p>{status}</p>)}
        </form>
    )
}