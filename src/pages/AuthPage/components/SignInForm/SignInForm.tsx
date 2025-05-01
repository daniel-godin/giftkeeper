import { FormEvent, useEffect, useState } from 'react'
import styles from './SignInForm.module.css'

interface SignInFormData {
    email: string;
    password: string;
}

export function SignInForm () {
    const [formData, setFormData] = useState<SignInFormData>({email: '', password: ''});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        try {

        } catch (error) {
            console.error('Error Signing In. Error:', error);
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
        </form>
    )
}