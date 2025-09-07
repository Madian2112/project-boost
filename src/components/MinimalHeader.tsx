import { Link } from 'react-router-dom';
import styles from './MinimalHeader.module.css';

export const MinimalHeader = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <img src="/assets/icons/logo_title.ico" alt="Project Boost Logo" className={styles.logoIcon} />
                    <span>Project <span className={styles.logoAccent}>Boost</span></span>
                </Link>
            </div>
        </header>
    );
};
