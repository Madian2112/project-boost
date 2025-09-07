import { Hero } from '../components/Hero';
import { Services } from '../components/Services';
import { About } from '../components/About';
import { Process } from '../components/Process';
import { Faq } from '../components/Faq';
import { Blog } from '../components/Blog';
import { Contact } from '../components/Contact';

export const HomePage = () => {
    return (
        <>
            <Hero />
            <Services />
            {/* <Products /> */}
            <About />
            <Process />
            <Faq />
            <Blog />
            <Contact />
        </>
    );
};
