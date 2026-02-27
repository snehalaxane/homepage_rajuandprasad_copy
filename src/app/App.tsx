import { useState, useEffect } from 'react';
import { ModernNavbar } from './components/modern-navbar';
import { ModernFooter } from './components/modern-footer';
import { HomePage } from './pages/home-page';
import { TeamPage } from './pages/team-page';
import { HistoryPage } from './pages/history-page';
import { SelectClientsPage } from './pages/select-clients-page';
import { ServicesPage } from './pages/services-page';
import { NetworkingPage } from './pages/networking-page';
import { NewsletterPage } from './pages/newsletter-page';
import { BlogPage } from './pages/blog-page';
import { AlumniPage } from './pages/alumni-page';
import { CareersPage } from './pages/careers-page';
import { GalleryPage } from './pages/gallery-page';
import { ContactPage } from './pages/contact-page';
import { LegalPage } from './pages/legal-page';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const mainPages = ['team', 'history', 'clients', 'services', 'networking', 'newsletter', 'blog', 'alumni', 'careers', 'gallery', 'contact'];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [legalSlugs, setLegalSlugs] = useState<string[]>([]);

  useEffect(() => {
    // Listen for hash changes for navigation
    const handleHashChange = () => {
      let hash = window.location.hash.slice(1) || 'home';
      // Remove leading slash if exists
      if (hash.startsWith('/')) hash = hash.slice(1);
      setCurrentPage(hash);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Set initial page from hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const fetchLegalSlugs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/legal`);
        const slugs = response.data
          .filter((p: any) => p.status === 'published')
          .map((p: any) => p.pageSlug.startsWith('/') ? p.pageSlug.slice(1) : p.pageSlug);
        setLegalSlugs(slugs);
      } catch (err) {
        console.error('Error fetching legal slugs:', err);
      }
    };
    fetchLegalSlugs();
  }, []);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/settings/theme`);
        const { primaryColor, secondaryColor } = response.data;
        if (primaryColor) {
          document.documentElement.style.setProperty('--primary', primaryColor);
        }
        if (secondaryColor) {
          document.documentElement.style.setProperty('--secondary', secondaryColor);
        }
      } catch (err) {
        console.error('Error fetching theme settings:', err);
      }
    };
    fetchTheme();
  }, []);

  const isLegalPage = legalSlugs.includes(currentPage);
  const isMainPage = mainPages.some(p => currentPage.startsWith(p));

  return (
    <div className="min-h-screen bg-white">
      <ModernNavbar activePage={currentPage} />

      <main>
        {/* Render HomePage for 'home' OR if the hash doesn't match any known page */}
        {(currentPage === 'home' || (!isMainPage && !isLegalPage)) &&
          <HomePage />
        }
        {currentPage === 'team' && <TeamPage />}
        {currentPage === 'history' && <HistoryPage />}
        {currentPage === 'clients' && <SelectClientsPage />}
        {currentPage === 'services' && <ServicesPage />}
        {currentPage === 'networking' && <NetworkingPage />}
        {currentPage === 'newsletter' && <NewsletterPage />}
        {currentPage.startsWith('blog') && <BlogPage />}
        {currentPage === 'alumni' && <AlumniPage />}
        {currentPage === 'careers' && <CareersPage />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'contact' && <ContactPage />}
        {isLegalPage && <LegalPage slug={currentPage} />}
      </main>

      <ModernFooter />
    </div>
  );
}
