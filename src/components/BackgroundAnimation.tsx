import styles from './BackgroundAnimation.module.css';

export const BackgroundAnimation = () => {
    const particles = Array.from({ length: 15 });

    return (
        <div className={styles.particleContainer}>
            {particles.map((_, i) => (
                <div key={i} className={styles.particle}></div>
            ))}
        </div>
    );
};
