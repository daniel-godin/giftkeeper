import styles from './PeoplePage.module.css'
import { useViewport } from '../../contexts/ViewportContext';
import { PeopleTable } from './components/PeopleTable/PeopleTable';
import { PeopleHeader } from './components/PeopleHeader/PeopleHeader';

export function PeoplePage () {
    const deviceType = useViewport();

    return (
        <section className={styles.peoplePage}>

            {/* Rename this to PeopleHeader */}
            <PeopleHeader />

            {/* Load table version if user is on desktop sized screen (768+px) */}
            {deviceType === 'desktop' && ( <PeopleTable /> )}

            {/* Load card list version if user is on mobile sized screen (below 768px) */}


        </section>
    )
}