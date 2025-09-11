import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import { HomePage } from './pages/HomePage';
import { BlogPage } from './pages/BlogPage';
import { ScrollToTop } from './components/ScrollToTop';
import { Chatbot } from './components/Chatbot';
import './App.css';

const MainLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <BackgroundAnimation />
      <Chatbot />
      <main>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
