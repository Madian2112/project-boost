import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import styles from './BlogPage.module.css';
import { MinimalHeader } from '../components/MinimalHeader';
import { Footer } from '../components/Footer';

export const BlogPage = () => {
    return (
        <>
            <MinimalHeader />
            <section className={styles.container}>
                <h1 className={styles.pageTitle}>Nuestro Blog</h1>
                <p className={styles.pageSubtitle}>Ideas, tutoriales y reflexiones sobre tecnología y desarrollo de software.</p>
                <div className={styles.postsGrid}>
                    {blogPosts.map(post => (
                        <Link to={`/blog/${post.slug}`} key={post.slug} className={styles.postCard}>
                            <h2 className={styles.postTitle}>{post.title}</h2>
                            <p className={styles.postExcerpt}>{post.excerpt}</p>
                            <span className={styles.readMore}>Leer más &rarr;</span>
                        </Link>
                    ))}
                </div>
            </section>
            <Footer />
        </>
    );
};
