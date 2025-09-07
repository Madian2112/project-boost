import { Code, Database, AppWindow, FileText, Bot, Briefcase } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { ServiceCard } from './ServiceCard';
import styles from './Services.module.css';

const services = [
    {
        title: "Desarrollo Web",
        description: "Creamos sitios y aplicaciones web a medida, desde páginas estáticas hasta sistemas complejos con bases de datos.",
        icon: <Code size={40} />
    },
    {
        title: "Aplicaciones de Escritorio",
        description: "Desarrollamos aplicaciones robustas y eficientes para Windows, macOS y Linux, adaptadas a tus necesidades.",
        icon: <AppWindow size={40} />
    },
    {
        title: "Bases de Datos",
        description: "Diseñamos y optimizamos bases de datos relacionales y no relacionales para garantizar la integridad y el rendimiento de tus datos.",
        icon: <Database size={40} />
    },
    {
        title: "Algoritmos y Tareas",
        description: "Resolvemos problemas algorítmicos y realizamos tareas de programación específicas, con código limpio y documentado.",
        icon: <Bot size={40} />
    },
    {
        title: "Sistemas de Información",
        description: "Construimos sistemas de información a medida para gestionar y procesar datos de manera efectiva en tu organización.",
        icon: <Briefcase size={40} />
    },
    {
        title: "Documentación Técnica",
        description: "Entregamos cada proyecto con documentación clara y completa para facilitar su mantenimiento y futuras expansiones.",
        icon: <FileText size={40} />
    }
];

export const Services = () => {
    return (
        <section className={styles.section} id="servicios">
            <div className={styles.container}>
                <FadeIn>
                    <div className={styles.titleWrapper}>
                        <h2>Nuestros Servicios</h2>
                        <p>Ofrecemos una gama completa de soluciones tecnológicas para llevar tu negocio al siguiente nivel.</p>
                    </div>
                </FadeIn>
                <div className={styles.cardsContainer}>
                    {services.map((service, index) => (
                        <FadeIn key={service.title} delay={(index + 1) * 0.1}>
                            <ServiceCard
                                title={service.title}
                                description={service.description}
                                icon={service.icon}
                            />
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};
