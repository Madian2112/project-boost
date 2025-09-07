import { useState } from 'react';
import { User, Target, Eye, Bot, Linkedin, Github } from 'lucide-react';
import { FadeIn } from './FadeIn';
import styles from './About.module.css';

const teamMembers = [
    {
        name: 'Jason Villanueva',
        role: 'CEO &Desarrollador Full Stack',
        imageUrl: '/assets/equipo/jason.jpg',
        socials: {
            linkedin: '#',
            github: '#'
        }
    },
    {
        name: 'Dany Franco',
        role: 'CEO & Desarrollador Full Stack',
        imageUrl: '/assets/equipo/dany.jpg',
        socials: {
            linkedin: '#',
            github: '#'
        }
    }
];


export const About = () => {
    const [activeTab, setActiveTab] = useState('mision');

    return (
        <section className={styles.section} id="nosotros">
            <div className={styles.container}>
                {/* --- Sobre Nosotros --- */}
                <FadeIn>
                    <div className={styles.titleWrapper}>
                        <h2>Sobre Nosotros</h2>
                        <p>Conoce más sobre Project Boost y nuestra pasión por crear soluciones tecnológicas innovadoras.</p>
                    </div>
                </FadeIn>

                <div className={styles.aboutContent}>
                    <div className={styles.whoWeAre}>
                        <FadeIn>
                            <h3>Quiénes Somos</h3>
                            <p>
                                Somos un equipo especializado en brindar soluciones digitales innovadoras para impulsar el crecimiento de tu negocio. Para evitar que tengas 
                                que realizar procesos repetitivos constantamente o actividades tediosas en tu dia a dia.                            </p>
                            <div className={styles.tabs}>
                                <button 
                                    className={`${styles.tabButton} ${activeTab === 'mision' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('mision')}
                                >
                                    <Target size={20} /> Misión
                                </button>
                                <button 
                                    className={`${styles.tabButton} ${activeTab === 'vision' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('vision')}
                                >
                                    <Eye size={20} /> Visión
                                </button>
                            </div>
                            <div className={styles.tabContent}>
                                {activeTab === 'mision' ? (
                                    <p>Nuestra misión es que cada empresa, sin importar su tamaño o sector, tenga acceso a soluciones tecnológicas de vanguardia que le permitan prosperar en un mercado competitivo.</p>
                                ) : (
                                    <p>Nuestra visión es ser la empresa líder en innovación tecnológica, reconocida por transformar radicalmente la eficiencia y productividad de nuestros clientes a nivel global.</p>
                                )}
                            </div>
                        </FadeIn>
                    </div>
                    <div className={styles.illustration}>
                        <FadeIn>
                            <Bot size={200} strokeWidth={1} />
                        </FadeIn>
                    </div>
                </div>

                {/* --- Nuestro Equipo --- */}
                <div className={styles.teamSection}>
                    <FadeIn>
                        <div className={styles.titleWrapper}>
                            <h3>Nuestro Equipo</h3>
                        </div>
                    </FadeIn>
                    <div className={styles.teamGrid}>
                        {teamMembers.map((member, index) => (
                             <FadeIn key={index} delay={(index + 1) * 0.1}>
                                <div className={styles.teamCard}>
                                    <div className={styles.memberImage}>
                                        <img src={member.imageUrl} alt={member.name} />
                                    </div>
                                    <h4 className={styles.memberName}>{member.name}</h4>
                                    <p className={styles.memberRole}>{member.role}</p>
                                    <div className={styles.memberSocials}>
                                        <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
                                        <a href={member.socials.github} target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
