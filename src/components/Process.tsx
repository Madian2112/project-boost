import { MessageCircle, Wrench, Rocket, LifeBuoy } from 'lucide-react';
import { FadeIn } from './FadeIn';
import styles from './Process.module.css';

const processSteps = [
    {
        icon: <MessageCircle size={32} />,
        title: 'Consulta y Estrategia',
        description: 'Analizamos tus ideas y necesidades para definir juntos la mejor estrategia y alcance para tu proyecto.'
    },
    {
        icon: <Wrench size={32} />,
        title: 'Diseño y Desarrollo',
        description: 'Construimos tu solución con tecnología de vanguardia, manteniéndote al tanto del progreso en cada fase.'
    },
    {
        icon: <Rocket size={32} />,
        title: 'Lanzamiento y Entrega',
        description: 'Desplegamos el proyecto en un entorno de producción y te entregamos el producto final, listo para operar.'
    },
    {
        icon: <LifeBuoy size={32} />,
        title: 'Soporte y Crecimiento',
        description: 'Te acompañamos después del lanzamiento, ofreciendo soporte y planes para futuras mejoras y escalabilidad.'
    }
];

export const Process = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <FadeIn>
                    <div className={styles.titleWrapper}>
                        <h2>Nuestro Proceso de Trabajo</h2>
                        <p>Creemos en un flujo de trabajo transparente y colaborativo para garantizar el éxito de tu proyecto.</p>
                    </div>
                </FadeIn>
                <div className={styles.stepsGrid}>
                    {processSteps.map((step, index) => (
                        <FadeIn key={index} delay={(index + 1) * 0.1}>
                            <div className={styles.stepCard}>
                                <div className={styles.stepHeader}>
                                    <div className={styles.stepIcon}>{step.icon}</div>
                                    <div className={styles.stepNumber}>0{index + 1}</div>
                                </div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};
