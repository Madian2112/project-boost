import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
                    <Link to="/" className={styles.logo}>
                        <img src="/assets/icons/logo_title.ico" alt="Project Boost Logo" className={styles.logoIcon} />
                        <span>Project <span className={styles.logoAccent}>Boost</span></span>
                    </Link>
                    <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                        <a href="/#servicios" onClick={closeMenu}>Servicios</a>
                        <a href="/#nosotros" onClick={closeMenu}>Nosotros</a>
                        <NavLink to="/blog" onClick={closeMenu}>Blog</NavLink>
                        <a href="/#contacto" className={`${styles.contactButton} ${styles.mobileOnly}`} onClick={closeMenu}>
                            Contáctanos
                        </a>
                    </nav>
                    <a href="/#contacto" className={`${styles.contactButton} ${styles.desktopOnly}`}>
                        Contáctanos
                    </a>
                    <button className={styles.hamburger} onClick={toggleMenu} aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </header>
            {isMenuOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
        </>
    );
};
