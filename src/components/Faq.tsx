import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FadeIn } from './FadeIn';
import styles from './Faq.module.css';

const faqData = [
    {
        question: "¿En qué tipos de proyectos pueden ayudarme?",
        answer: "Podemos ayudarte con una amplia gama de proyectos incluyendo desarrollo web, aplicaciones de escritorio, bases de datos, algoritmos, sistemas de información y más. Nos especializamos en proyectos de programación y tecnología."
    },
    {
        question: "¿Cuánto tiempo toma desarrollar un proyecto?",
        answer: "El tiempo de desarrollo varía según la complejidad del proyecto. Proyectos simples pueden completarse en 1-2 semanas, mientras que proyectos más complejos pueden tomar 4-8 semanas. Siempre nos ajustamos a tus plazos de entrega."
    },
    {
        question: "¿Ofrecen garantía en sus servicios?",
        answer: "Sí, ofrecemos garantía de satisfacción en todos nuestros servicios. Trabajamos hasta que el proyecto cumpla con todos los requisitos y estándares académicos requeridos."
    }
];

const FaqItem = ({ item, isOpen, onClick }) => {
    return (
        <div className={styles.faqItem}>
            <button className={styles.faqQuestion} onClick={onClick}>
                <span>{item.question}</span>
                <ChevronDown className={`${styles.chevron} ${isOpen ? styles.open : ''}`} size={24} />
            </button>
            <div className={`${styles.faqAnswer} ${isOpen ? styles.open : ''}`}>
                <p>{item.answer}</p>
            </div>
        </div>
    );
};

export const Faq = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <FadeIn>
                    <div className={styles.titleWrapper}>
                        <h2>Preguntas Frecuentes</h2>
                        <p>Resolvemos algunas de las dudas más comunes de nuestros clientes.</p>
                    </div>
                </FadeIn>
                <div className={styles.faqList}>
                    {faqData.map((item, index) => (
                        <FadeIn key={index} delay={(index + 1) * 0.1}>
                           <FaqItem
                                item={item}
                                isOpen={openIndex === index}
                                onClick={() => handleClick(index)}
                            />
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};
