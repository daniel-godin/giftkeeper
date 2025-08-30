import { deleteDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext";
import { getEventDocRef } from "../firebase/firestore";
import { devError, devLog } from "../utils/logger";
import { Event } from "../types/EventType";

export const useEventsActions = () => {
    const { authState } = useAuth();
    const { addToast } = useToast();

    // Deletes one event document.
    // Returns boolean to help component functions do different things, depending on success/failure.
    const deleteEvent = async (event: Event): Promise<boolean> => {
        if (!authState.user) { return false }; // Auth Guard Clause
        if (!event || !event.id) { // No/Invalid Input
            addToast({
                type: 'warning',
                title: 'Warning!',
                message: 'Invalid data.  Cannot delete event. Please try again.'
            })
            return false;
        }; 

        // TODO:  Make this a custom confirmation modal.
        if (!window.confirm(`Are you sure you want to delete ${event.title}?`)) {
            return false; // Confirm Window
        }

        try {
            const docRef = getEventDocRef(authState.user.uid, event.id)
            await deleteDoc(docRef);

            devLog(`Successfully deleted event with eventId: ${event.id}.`)
            addToast({
                type: 'success',
                title: 'Event Deleted',
                message: `You have successfully deleted ${event.title}.`
            })

            return true;

        } catch (error) {
            devError('Error Deleting Event. Error:', error);
            addToast({
                type: 'error',
                title: 'Delete Failed',
                message: `Unable to delete ${event.title}. Please try again.`,
                error: error as Error
            })

            return false;
        }
    }

    return { deleteEvent };
}