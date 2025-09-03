import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import styles from './Header.module.css';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    }

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isMenuOpen]);

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    <a href="/" className={styles.logo}>
                        <img src="/assets/icons/logo_title.ico" alt="Project Boost Logo" className={styles.logoIcon} />
                        <span>Project <span className="text-gradient">Boost</span></span>
                    </a>
                    <nav className={styles.desktopNav}>
                        <a href="#inicio">Inicio</a>
                        <a href="#servicios">Servicios</a>
                        <a href="#contacto">Contacto</a>
                    </nav>
                    <button className={styles.hamburger} onClick={toggleMenu} aria-label="Abrir menú">
                        <Menu size={32} />
                    </button>
                </div>
            </header>
            <div className={`${styles.mobileNavOverlay} ${isMenuOpen ? styles.isOpen : ''}`}>
                <button className={styles.closeBtn} onClick={toggleMenu} aria-label="Cerrar menú">
                    <X size={40} />
                </button>
                <div className={styles.mobileNav}>
                    <a href="#inicio" className={styles.mobileLink} onClick={closeMenu}>Inicio</a>
                    <a href="#servicios" className={styles.mobileLink} onClick={closeMenu}>Servicios</a>
                    <a href="#contacto" className={styles.mobileLink} onClick={closeMenu}>Contacto</a>
                </div>
            </div>
        </>
    );
};
