import { Instagram, Mail, MessageSquare } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { ContactForm } from './ContactForm';
import styles from './Contact.module.css';


export const Contact = () => {
    return (
        <section className={styles.section} id="contacto">
            <div className={styles.container}>
                <FadeIn>
                    <h2 className={styles.ServiceGradient}>¿Listo para empezar tu proyecto?</h2>
                    <p>
                        Envíanos un mensaje. Estaremos encantados de escuchar tu idea y ayudarte a llevar tu proyecto al siguiente nivel.
                    </p>
                    <div className={styles.socialLinks}>
                        <a href="#" target="_blank" className={styles.socialLink}>
                            <Instagram size={24} />
                            <span>Instagram</span>
                        </a>
                        <a href="mailto:projectboosthn@gmail.com" className={styles.socialLink}>
                            <Mail size={24} />
                            <span>Gmail</span>
                        </a>
                        <a href="#" target="_blank" className={styles.socialLink}>
                            <MessageSquare size={24} />
                            <span>WhatsApp</span>
                        </a>
                    </div>
                    
                    <hr className={styles.divider} />

                    <ContactForm />
                </FadeIn>
            </div>
        </section>
    );
};
