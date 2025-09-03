import { motion } from 'framer-motion';
import { FadeIn } from './FadeIn';
import styles from './Hero.module.css';

export const Hero = () => {
    return (
        <section className={styles.section} id="inicio">
            <div className={styles.container}>
                <div className={styles.content}>
                    <FadeIn>
                        <h1>Tu proyecto universitario, <br /><span className="text-gradient">nuestra pasión y experiencia.</span></h1>
                        <p>
                            Transformamos tus ideas en proyectos de programación exitosos. Desde simples tareas hasta complejas aplicaciones, estamos aquí para ayudarte a destacar.
                        </p>
                        <a href="#contacto" className={styles.cta}>Contáctanos Ahora</a>
                    </FadeIn>
                </div>
                <div className={styles.visual}>
                     <motion.div
                        className={styles.placeholder}
                        animate={{ y: [0, -15, 0] }}
                        transition={{
                            duration: 8,
                            ease: "easeInOut",
                            repeat: Infinity,
                        }}
                    />
                </div>
            </div>
        </section>
    );
};
