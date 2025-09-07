import { FadeIn } from './FadeIn';
import styles from './Hero.module.css';

export const Hero = () => {
    return (
        <section className={styles.hero} id="inicio">
            <div className={styles.container}>
                <FadeIn>
                    <h1 className={styles.title}>
                        Transformamos <span className={styles.highlight}>ideas</span> en soluciones digitales
                    </h1>
                    <p className={styles.description}>
                        Desarrollamos aplicaciones web y sistemas personalizados que impulsan el crecimiento de tu negocio con tecnología de vanguardia.
                    </p>
                    <div className={styles.buttonGroup}>
                        <a href="#servicios" className={styles.ctaButton}>Nuestros Servicios</a>
                        <a href="#contacto" className={`${styles.ctaButton} ${styles.outlineButton}`}>Contáctanos</a>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};
