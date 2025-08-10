import { useNavigate } from 'react-router';
import styles from './SignUpForm.module.css'
import { FormEvent, useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../../../../firebase/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { FormInput, FormSubmitButton } from '../../../../components/ui';
import { DEFAULT_USER_PROFILE } from '../../../../constants/defaultObjects';
import { useToast } from '../../../../contexts/ToastContext';
import { devError } from '../../../../utils/logger';

interface SignUpFormData {
    email: string;
    password: string;
}

export function SignUpForm () {
    const navigate = useNavigate();
    const { addToast } = useToast();

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
            addToast({
                type: 'warning',
                title: 'Password Issue',
                message: 'Password must be at least 8+ characters long'
            })
            return;
        };

        setIsSubmitting(true);

        try {
            const newUser = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            await sendEmailVerification(newUser.user);

            // Create User Document In Firestore (db, 'users', {userId})
            const newUserDocRef = doc(db, 'users', newUser.user.uid);
            const newUserData = {
                ...DEFAULT_USER_PROFILE,
                id: newUser.user.uid,

                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newUserDocRef, newUserData);

            addToast({
                type: 'success',
                title: 'Successfully Signed Up',
                message: 'Email verification sent.  Please verify your email.  Redirecting you to your dashboard',
            })
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000)
        } catch (error: any) {
            devError('Error Creating Account. Error:', error);

            let errorMessage = 'Error creating account. Please try again.';
             
            if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email';
            }

            addToast({
                type: 'error',
                title: "Error Signing Up",
                message: errorMessage,
                error: error as Error
            })

            setIsSubmitting(false);
        }
    }

    return (
        <form className={styles.signUpForm} onSubmit={handleSubmit}>

            {/* Sign Up Email: */}
            <FormInput
                label='Email:'
                type='email'
                name='email'
                required={true}
                disabled={isSubmitting}
                value={formData.email}
                onChange={handleInputChange}
            />

            {/* Sign Up Password: (note: no confirming password input. Use email verify.) */}
            <FormInput
                label='Password: (8+ characters)'
                type='password'
                name='password'
                required={true}
                disabled={isSubmitting}
                value={formData.password}
                onChange={handleInputChange}
            />

            <FormSubmitButton
                text='Sign Up'
                isSubmitting={isSubmitting}
                submittingText='Signing Up...'
                disabled={!formData.email.trim() || !formData.password.trim() || formData.password.length < 8}
            />
            
        </form>
    )
}