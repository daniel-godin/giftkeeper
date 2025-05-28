import { useEffect, useRef, useState } from 'react';
import styles from './EditableTitle.module.css'
import { Check } from 'lucide-react';

interface EditableTitleProps {
    value: string;
    onSave: (newValue: string) => Promise<void>;
    tagName?: 'h1' | 'h2' | 'h3';
    className?: string;
}

export function EditableTitle({
    value,
    onSave,
    tagName: TagName = 'h2',
    className
} : EditableTitleProps ) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when entering edit mode
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = async () => {
        if (editValue.trim() === '') { return; };
        if (editValue === value) { setIsEditing(false); return; }

        setIsSaving(true);
        try {
            await onSave(editValue);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save title. Error:', error);
        } finally {
            setIsSaving(false);
        }
    }

    // Return this if editing the title.
    if (isEditing) {
        return (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <input 
                    ref={inputRef}
                    type='text'
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSave}
                    disabled={isSaving}
                    className={`${styles.input} ${className}`}
                />
                <button className={styles.submitButton}><Check /></button>
            </form>
        )
    }

    // Return this if NOT editing the title. Default behavior.
    return (
        <TagName
            onClick={() => { setIsEditing(true) }}
            className={`${styles.title} ${className}`}
        >
            {value}
        </TagName>
    )
}