import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { GiftItem } from "../../../types/GiftListType";


interface AddGiftItemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddGiftItemModal({ isOpen, onClose } : AddGiftItemModalProps) {
    const { authState } = useAuth();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<GiftItem>({ name: '' });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

}