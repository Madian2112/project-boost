import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import styles from './BlogPostPage.module.css';
import { MinimalHeader } from '../components/MinimalHeader';
import { Footer } from '../components/Footer';
import { ArrowLeft } from 'lucide-react';

export const BlogPostPage = () => {
    const { slug } = useParams();
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return (
            <div className={styles.container}>
                <h2>Post no encontrado</h2>
                <p>Lo sentimos, no pudimos encontrar el artículo que estás buscando.</p>
                <Link to="/blog">Volver al blog</Link>
            </div>
        );
    }

    return (
        <>
            <MinimalHeader />
            <article className={styles.container}>
                <Link to="/blog" className={styles.backLink}>
                    <ArrowLeft size={16} /> Volver a todos los posts
                </Link>
                <h1 className={styles.title}>{post.title}</h1>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <div className={styles.content}>
                    <p>{post.content}</p>
                </div>
            </article>
            <Footer />
        </>
    );
};
