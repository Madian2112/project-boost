import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const socialLinks = [
    { icon: <Github size={24} />, href: '#' },
    { icon: <Linkedin size={24} />, href: '#' },
    { icon: <Twitter size={24} />, href: '#' },
    { icon: <Mail size={24} />, href: '#' }
];

const footerLinks = [
    {
        title: 'Servicios',
        links: [
            { text: 'Desarrollo Web', href: '#' },
            { text: 'Aplicaciones', href: '#' },
            { text: 'Bases de Datos', href: '#' },
            { text: 'Sistemas', href: '#' }
        ]
    },
    {
        title: 'Empresa',
        links: [
            { text: 'Sobre Nosotros', href: '/#nosotros' },
            { text: 'Blog', href: '/blog' },
            { text: 'Contacto', href: '/#contacto' }
        ]
    }
];

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.mainContent}>
                    <div className={styles.brandInfo}>
                        <Link to="/" className={styles.logo}>
                            <img src="/assets/icons/logo_title.ico" alt="Project Boost Logo" className={styles.logoIcon} />
                            <span>Project <span className={styles.logoAccent}>Boost</span></span>
                        </Link>
                        <p className={styles.description}>
                            Transformamos ideas en soluciones digitales innovadoras para impulsar el crecimiento de tu negocio.
                        </p>
                        <div className={styles.socialIcons}>
                            {socialLinks.map((link, index) => (
                                <a key={index} href={link.href} target="_blank" rel="noopener noreferrer">{link.icon}</a>
                            ))}
                        </div>
                    </div>
                    <div className={styles.linksGrid}>
                        {footerLinks.map((column) => (
                            <div key={column.title} className={styles.linkColumn}>
                                <h4>{column.title}</h4>
                                <ul>
                                    {column.links.map((link) => (
                                        <li key={link.text}><Link to={link.href}>{link.text}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.bottomBar}>
                    <p>&copy; {new Date().getFullYear()} Project Boost. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};
