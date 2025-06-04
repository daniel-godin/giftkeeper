import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'
import { usePeople } from '../../contexts/PeopleContext';
import styles from './DashboardPage.module.css'

export function DashboardPage () {
    const { authState } = useAuth();
    const { people, loading: peopleLoading } = usePeople();

    if (peopleLoading) {
        <div>Loading People...</div>
    }

    if (people.length === 0) {
        <div>
            <h1>Welcome to Gift Keeper!</h1>
            <p>Let's start by adding the people you buy gifts for.</p>
            <button>Add Your First Person</button>
        </div>
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>You have {people.length} people in your circle.</p>
        </div>
    )
}