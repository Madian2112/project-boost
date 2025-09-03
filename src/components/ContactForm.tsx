import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import styles from './ContactForm.module.css';

export const ContactForm = () => {
    const form = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.current) return;

        const currentForm = form.current;
        if (!currentForm.Nombre.value || !currentForm.asunto.value || !currentForm.correo.value) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        // --- Asegúrate de que estas variables de entorno estén definidas ---
        const serviceID = import.meta.env.VITE_EMAIL_SERVICE_ID;
        const teamTemplateID = import.meta.env.VITE_EMAIL_TEAM_TEMPLATE_ID;   // Plantilla para tu equipo
        const userTemplateID = import.meta.env.VITE_EMAIL_USER_TEMPLATE_ID;   // Plantilla para el usuario
        const publicKey = import.meta.env.VITE_EMAIL_KEY;
        // ----------------------------------------------------------------

        emailjs.sendForm(serviceID, teamTemplateID, currentForm, publicKey)
            .then(() => {
                console.log('Notificación al equipo enviada con éxito.');
                emailjs.sendForm(serviceID, userTemplateID, currentForm, publicKey)
                    .then(() => {
                        console.log('Correo de confirmación al usuario enviado con éxito.');
                        alert('¡Gracias por tu mensaje! Te hemos enviado un correo de confirmación.');
                        currentForm.reset();
                    }, (error) => {
                        console.log('FALLO al enviar la confirmación al usuario...', error.text);
                        alert('Hemos recibido tu mensaje, pero hubo un problema al enviar la confirmación a tu correo.');
                    });
            }, (error) => {
                console.log('FALLO al enviar la notificación al equipo...', error.text);
                alert('Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.');
            });
    };

    return (
        <form ref={form} className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="Nombre">Nombre</label>
                <input type="text" id="Nombre" name="Nombre" required />
            </div>
             <div className={styles.formGroup}>
                <label htmlFor="correo">Correo Electrónico</label>
                <input type="email" id="correo" name="correo" required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="telefono">Número telefónico (Opcional)</label>
                <input type="tel" id="telefono" name="telefono" />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="asunto">Asunto</label>
                <input type="text" id="asunto" name="asunto" required />
            </div>
            <button type="submit" className={styles.submitButton}>Enviar Mensaje</button>
        </form>
    );
};
