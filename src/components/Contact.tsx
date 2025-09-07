import { Mail, Phone, MapPin } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { ContactForm } from './ContactForm';
import styles from './Contact.module.css';

const contactDetails = [
    {
        icon: <Mail size={24} />,
        title: "Correo Electrónico",
        contact: "projectboost@email.com"
    },
    {
        icon: <MapPin size={24} />,
        title: "Ubicación",
        contact: "San Pedro Sula, Honduras"
    }
];

export const Contact = () => {
    return (
        <section className={styles.section} id="contacto">
            <div className={styles.container}>
                <FadeIn>
                    <div className={styles.titleWrapper}>
                        <h2>Contáctanos</h2>
                        <p>¿Tienes un proyecto en mente? Estamos listos para ayudarte a hacerlo realidad.</p>
                    </div>
                </FadeIn>
                <div className={styles.contentWrapper}>
                    <div className={styles.formContainer}>
                        <ContactForm />
                    </div>
                    <div className={styles.detailsContainer}>
                        {contactDetails.map((detail) => (
                            <div key={detail.title} className={styles.detailItem}>
                                <div className={styles.iconWrapper}>{detail.icon}</div>
                                <div className={styles.textWrapper}>
                                    <h3 className={styles.detailTitle}>{detail.title}</h3>
                                    <p className={styles.detailContact}>{detail.contact}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
