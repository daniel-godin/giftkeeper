import { usePeople } from '../../../../contexts/PeopleContext'
import { Person } from '../../../../types/PersonType';
import styles from './PeopleList.module.css'
import { formatBirthdayShort, getDaysUntilNextBirthday, getEventUrgency } from '../../../../utils';
import { Link } from 'react-router';
import { formatCurrency } from '../../../../utils/currencyUtils';

interface PeopleListProps {
    people: Person[];
    giftStatsByPerson: Record<string, { giftCount: number; totalSpent: number }>
}

export function PeopleList({ people, giftStatsByPerson } : PeopleListProps) {
    const { loading: loadingPeople } = usePeople();

    return (
        <>
            {loadingPeople ? (
                <PeopleCardSkeleton />
            ) : (
                <div className={styles.peopleListContainer}>
                    {/* Mapping of "filtered/sorted people" */}
                    {people && people.map(person => (
                        <Link to={`/people/${person.id}`} key={person.id} className={`unstyled-link`}>
                            <div className={styles.personCard}>
                                <div className={styles.cardRow}>
                                    <div className={styles.nameWithAvatar}>
                                        <div className={styles.avatar}>{person.name.slice(0, 1)}</div>
                                        <span className={styles.personName}>{person.name}</span>
                                    </div>

                                    {person.id && giftStatsByPerson && giftStatsByPerson[person.id] && (
                                            <span className={styles.giftCount}>{giftStatsByPerson[person.id].giftCount} 🎁</span>
                                        )}
                                </div>
                                <div className={styles.cardRow}>
                                    <div className={styles.leftSide}>
                                        {person.relationship && (<span className={styles.relationTag}>{person.relationship}</span>)}
                                        {person.relationship && person.birthday && ( <span> • </span> )}
                                        {person.birthday && (
                                            <div className={styles.birthdayInfo}>
                                                <div className={styles.birthdayDate}>{formatBirthdayShort(person.birthday)}</div>
                                                {getDaysUntilNextBirthday(person.birthday) ? (
                                                    <div 
                                                        className={`${styles.birthdayCountdown} ${styles[getEventUrgency(person.birthday, 'birthday')]}`}
                                                    >
                                                        ({getDaysUntilNextBirthday(person.birthday)} days)
                                                    </div>
                                                ) : (
                                                    <div className={styles.birthdayCountdown}>--</div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.rightSide}>
                                        {person.id && giftStatsByPerson && giftStatsByPerson[person.id] && (
                                            <span className={styles.spentAmount}>{formatCurrency(giftStatsByPerson[person.id].totalSpent)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    )
}

export function PeopleCardSkeleton() {

    return (
        <div className={styles.peopleListContainer}>
            <div className={styles.personCard}>
                <div className='skeleton-line' style={{ width: '100%' }}></div>
                <div className='skeleton-line' style={{ width: '100%' }}></div>
            </div>

            <div className={styles.personCard}>
                <div className='skeleton-line' style={{ width: '100%' }}></div>
                <div className='skeleton-line' style={{ width: '100%' }}></div>
            </div>

            <div className={styles.personCard}>
                <div className='skeleton-line' style={{ width: '100%' }}></div>
                <div className='skeleton-line' style={{ width: '100%' }}></div>
            </div>
        </div>
    )
}