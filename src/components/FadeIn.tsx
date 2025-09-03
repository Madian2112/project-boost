import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    delay?: number;
}

export const FadeIn = ({ children, delay = 0 }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
                duration: 0.8, 
                delay: delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
        >
            {children}
        </motion.div>
    );
};
