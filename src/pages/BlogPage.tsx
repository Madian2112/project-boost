import { FadeIn } from '../components/FadeIn';
import styles from './BlogPage.module.css';
import { blogPosts } from '../data/blogPosts';
import { MinimalHeader } from '../components/MinimalHeader';

export const BlogPage = () => {
    return (
        <>
            <MinimalHeader />
            <main className={styles.page}>
                <div className={styles.container}>
                    <FadeIn>
                        <div className={styles.titleWrapper}>
                            <h1>Nuestro Blog</h1>
                            <p>Un espacio para compartir conocimiento, explorar tecnologías y discutir las últimas tendencias en el desarrollo de software.</p>
                        </div>
                    </FadeIn>
                    <div className={styles.postsGrid}>
                        {blogPosts.map((post, index) => (
                            <FadeIn key={index} delay={(index + 1) * 0.1}>
                                <div className={styles.postCard}>
                                    <h3>{post.title}</h3>
                                    <p>{post.excerpt}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
};
