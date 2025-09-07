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
                        <NavLink to="/#servicios" onClick={closeMenu}>Servicios</NavLink>
                        <NavLink to="/#nosotros" onClick={closeMenu}>Nosotros</NavLink>
                        <NavLink to="/blog" onClick={closeMenu}>Blog</NavLink>
                        <NavLink to="/#contacto" onClick={closeMenu}>Contacto</NavLink>
                        <Link to="/#contacto" className={`${styles.contactButton} ${styles.mobileOnly}`} onClick={closeMenu}>
                            Contáctanos
                        </Link>
                    </nav>
                    <Link to="/#contacto" className={`${styles.contactButton} ${styles.desktopOnly}`}>
                        Contáctanos
                    </Link>
                    <button className={styles.hamburger} onClick={toggleMenu} aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </header>
            {isMenuOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
        </>
    );
};
