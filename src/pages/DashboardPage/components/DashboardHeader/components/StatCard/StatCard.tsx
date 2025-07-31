import { Link } from 'react-router';
import styles from './StatCard.module.css'

interface StatCardProps {
    to: string;
    title: string;
    totalCount: number;
    breakdownStats: Array<{ count: number; label: string; }>;
}

export function StatCard({ to, title, totalCount, breakdownStats } : StatCardProps) {

    return (
        <Link
            to={to}
            className={`unstyled-link ${styles.statCard}`}
        >
            <header className={styles.statTitle}>{title}</header>
            <div className={styles.totalStat}>{totalCount}</div>
            <div className={styles.statsBrokenDown}>
                {breakdownStats.map((stat, index) => (
                    <div key={index} className={styles.breakdownStat}>
                        <span className={styles.statCount}>{stat.count}</span>
                        <span className={styles.statLabel}>{stat.label}</span>
                    </div>
                ))}
            </div>
        </Link>
    )
}