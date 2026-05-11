import { useEffect } from 'react';
import axios from 'axios';

interface SEOProps {
  pageName: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function SEO({ pageName }: SEOProps) {
  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/seo`);
        const allSEO = response.data;
        
        // Find SEO for current page or fallback to Home
        const seo = allSEO.find((p: any) => 
          p.pageName.toLowerCase() === pageName.toLowerCase() || 
          p.pageName.toLowerCase() === 'home'
        );

        if (seo) {
          // 1. Update Title
          document.title = seo.metaTitle || 'Raju & Prasad';

          // 2. Update Meta Tags
          const updateMeta = (name: string, content: string, property: boolean = false) => {
            if (!content) return;
            let el = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
            if (!el) {
              el = document.createElement('meta');
              if (property) el.setAttribute('property', name);
              else el.setAttribute('name', name);
              document.head.appendChild(el);
            }
            el.setAttribute('content', content);
          };

          updateMeta('description', seo.metaDescription);
          updateMeta('keywords', Array.isArray(seo.keywords) ? seo.keywords.join(', ') : seo.keywords);
          
          // Robots
          const robots = `${seo.indexPage ? 'index' : 'noindex'}, ${seo.followLinks ? 'follow' : 'nofollow'}`;
          updateMeta('robots', robots);

          // Standard OG tags using core fields
          updateMeta('og:title', seo.metaTitle, true);
          updateMeta('og:description', seo.metaDescription, true);
        }
      } catch (err) {
        console.error('Failed to fetch SEO config:', err);
      }
    };

    fetchSEO();
  }, [pageName]);

  return null; // This component doesn't render anything
}
