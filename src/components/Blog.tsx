import { FadeIn } from './FadeIn';
import styles from './Blog.module.css';
import { Link } from 'react-router-dom';

export const Blog = () => {
    return (
        <section className={styles.section} id="blog">
            <div className={styles.container}>
                <FadeIn>
                    <div className={styles.titleWrapper}>
                        <h2>Desde Nuestro Blog</h2>
                        <p>¿Interesado en las últimas tendencias de tecnología y desarrollo de software? Visita nuestro blog para leer análisis, guías y nuestra perspectiva sobre la industria.</p>
                        <div className={styles.viewAllWrapper}>
                            <Link to="/blog" className={styles.viewAllButton}>Ir al Blog</Link>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};
