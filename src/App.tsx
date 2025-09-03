import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import './App.css';

function App() {
  return (
    <>
      <BackgroundAnimation />
      <Header />
      <main>
        <Hero />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
