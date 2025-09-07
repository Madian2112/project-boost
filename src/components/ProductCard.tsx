import styles from './ProductCard.module.css';
import type { ReactNode } from 'react';

interface Props {
    title: string;
    description: string;
    icon: ReactNode;
    tags: string[];
}

export const ProductCard = ({ title, description, icon, tags }: Props) => {
    return (
        <div className={styles.card}>
            <div className={styles.iconWrapper}>{icon}</div>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.tags}>
                {tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                ))}
            </div>
            <p className={styles.description}>{description}</p>
        </div>
    );
};
