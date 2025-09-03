import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import styles from './ServiceCard.module.css';
import type { ReactNode } from 'react';

interface Props {
    title: string;
    description: string;
    icon: ReactNode;
}

export const ServiceCard = ({ title, description, icon }: Props) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: -1, y: -1 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (cardRef.current) {
                const rect = cardRef.current.getBoundingClientRect();
                setMousePosition({ 
                    x: e.clientX - rect.left, 
                    y: e.clientY - rect.top 
                });
            }
        };

        const currentCard = cardRef.current;
        currentCard?.addEventListener('mousemove', handleMouseMove);

        return () => {
            currentCard?.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const cardStyle = {
        '--x': `${mousePosition.x}px`,
        '--y': `${mousePosition.y}px`,
    } as React.CSSProperties;

    return (
        <motion.div
            ref={cardRef}
            className={styles.card}
            style={cardStyle}
        >
            <div className={styles.iconWrapper}>{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
        </motion.div>
    );
};
