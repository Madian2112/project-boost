import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import styles from './ContactForm.module.css';

export const ContactForm = () => {
    const form = useRef<HTMLFormElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.current) return;

        const currentForm = form.current;
        if (!currentForm.Nombre.value || !currentForm.asunto.value || !currentForm.correo.value) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        setIsLoading(true);

        // --- Asegúrate de que estas variables de entorno estén definidas ---
        const serviceID = import.meta.env.VITE_EMAIL_SERVICE_ID;
        const teamTemplateID = import.meta.env.VITE_EMAIL_TEAM_TEMPLATE_ID;   // Plantilla para tu equipo
        const publicKey = import.meta.env.VITE_EMAIL_KEY;
        // ----------------------------------------------------------------

        try {
            await Promise.all([
                emailjs.sendForm(serviceID, teamTemplateID, currentForm, publicKey),
            ]);
            
            console.log('Ambos correos enviados con éxito.');
            alert('¡Gracias por tu mensaje! Te hemos enviado un correo de confirmación.');
            currentForm.reset();
            
        } catch (error) {
            console.log('Error al enviar correos:', error);
            alert('Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form ref={form} className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="Nombre">Nombre</label>
                <input type="text" id="Nombre" name="Nombre" required />
            </div>
             <div className={styles.formGroup}>
                <label htmlFor="correo">Correo Electrónico</label>
                <input type="email" id="correo" name="correo" placeholder="tu@email.com" required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="telefono">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" placeholder="Tu número de teléfono" />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="asunto">Asunto</label>
                <textarea id="asunto" name="asunto" rows={5} placeholder="Cuéntanos sobre tu proyecto..." required />
            </div>
            <button type="submit" className={styles.submitButton}>
                {isLoading ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
        </form>
    );
};
