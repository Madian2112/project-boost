import { ShoppingCart, Flower2 } from 'lucide-react';
import { FadeIn } from './FadeIn';
import { ProductCard } from './ProductCard';
import styles from './Products.module.css';

const products = [
    {
        title: "EmpreShop",
        description: "Plataforma de comercio electrónico con gestión de inventario, pagos integrados y panel de administración.",
        icon: <ShoppingCart size={40} />,
        tags: ["E-Commerce", "Web", "Pagos"]
    },
    {
        title: "FlowerTrack",
        description: "Sistema para floristerías que permite gestionar inventario, pedidos, reportes de ventas y administración completa del negocio.",
        icon: <Flower2 size={40} />,
        tags: ["Floristerías", "Inventario", "Ventas"]
    },
];

export const Products = () => {
    return (
        <section className={styles.section} id="productos">
            <div className={styles.container}>
                <FadeIn>
                    <div className={styles.titleWrapper}>
                        <h2>Nuestros Productos</h2>
                        <p>Soluciones desarrolladas a medida para diferentes industrias y necesidades específicas.</p>
                    </div>
                </FadeIn>
                <div className={styles.cardsContainer}>
                    {products.map((product, index) => (
                        <FadeIn key={product.title} delay={(index + 1) * 0.1}>
                            <ProductCard
                                title={product.title}
                                description={product.description}
                                icon={product.icon}
                                tags={product.tags}
                            />
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};
