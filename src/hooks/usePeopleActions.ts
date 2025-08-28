import { deleteDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext";
import { getPersonDocRef } from "../firebase/firestore";
import { Person } from "../types/PersonType";
import { devError, devLog } from "../utils/logger";


export const usePeopleActions = () => {
    const { authState } = useAuth();
    const { addToast } = useToast();

    // Deletes one person document.
    // Returns boolean to help component functions do different things, depending success/failure.
    const deletePerson = async (person: Person): Promise<boolean> => {
        if (!authState.user) { return false }; // Auth Guard Clause
        if (!person || !person.id) { // No/Invalid Input
            addToast({
                type: 'warning',
                title: 'Warning!',
                message: 'Invalid data.  Cannot delete person. Please try again.'
            })
            return false;
        }; 

        // TODO:  Make this a custom confirmation modal.
        if (!window.confirm(`Are you sure you want to delete ${person.name}?`)) {
            return false; // Confirm Window
        }

        try {
            const docRef = getPersonDocRef(authState.user.uid, person.id);
            await deleteDoc(docRef);

            devLog(`Successfully deleted person with personId: ${person.id}.`)
            addToast({
                type: 'success',
                title: 'Person Delete',
                message: `You have successfully deleted ${person.name}.`
            })

            return true;

        } catch (error) {
            devError('Error Deleting Person. Error:', error);
            addToast({
                type: 'error',
                title: 'Delete Failed',
                message: `Unable to delete ${person.name}. Please try again.`,
                error: error as Error
            })

            return false;
        }
    }

    return { deletePerson };
}