import styles from './Footer.module.css';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p>&copy; {new Date().getFullYear()} Project Boost. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};
