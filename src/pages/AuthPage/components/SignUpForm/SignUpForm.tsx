import { useNavigate } from 'react-router';
import styles from './SignUpForm.module.css'
import { FormEvent, useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../../../../firebase/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

interface SignUpFormData {
    email: string;
    password: string;
}

export function SignUpForm () {
    const navigate = useNavigate();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<SignUpFormData>({ email: '', password: '' });
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

        if (!formData.email || !formData.password) { return }; // Guard Clause
        if (formData.password.length < 8) { 
            setStatus('Password must be at least 8+ characters'); 
            return 
        };

        setStatus('Signing Up...');
        setIsSubmitting(true);
        try {
            const newUser = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            await sendEmailVerification(newUser.user);

            // Create User Document In Firestore (db, 'users', {userId})
            const newUserDocRef = doc(db, 'users', newUser.user.uid);
            const newUserData = {
                id: newUser.user.uid,
                email: newUser.user.email,

                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newUserDocRef, newUserData);

            setStatus('Check Email To Verify Your Email.  Redirecting you to dashboard...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500)
        } catch (error: any) {
            console.error('Error Creating Account. Error:', error);

            let errorMessage = 'Error creating account. Please try again.';
             
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered';
            } else if (error.code == 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email';
            }

            setStatus(errorMessage);
            setIsSubmitting(false);
        }
    }

    return (
        <form className={styles.signUpForm} onSubmit={handleSubmit}>
            <h2 className={styles.formHeader}>Sign Up</h2>
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
            <label className={styles.label}>Password:
                <input
                    type='password'
                    name='password'
                    minLength={8}
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={styles.input}
                />
            </label>

            <button type='submit' className={styles.button} disabled={isSubmitting}>Sign Up</button>

            {status && (<p className={styles.statusText}>{status}</p>)}
        </form>
    )
}