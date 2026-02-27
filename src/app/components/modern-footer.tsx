import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Github, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const iconMap: any = {
  facebook: Facebook,
  twitter: X,
  instagram: Instagram,
  linkedin: Linkedin

};

export function ModernFooter() {
  const [footerContent, setFooterContent] = useState<any>(null);
  const [quickLinks, setQuickLinks] = useState<any[]>([]);
  const [footerContact, setFooterContact] = useState<any>(null);
  const [footerSections, setFooterSections] = useState<any[]>([]);
  const [generalSettings, setGeneralSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [legalPages, setLegalPages] = useState<any[]>([]);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [contentRes, quickLinksRes, contactRes, sectionsRes, generalRes, legalRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/footer-content`),
          axios.get(`${API_BASE_URL}/api/quick-links`),
          axios.get(`${API_BASE_URL}/api/footer-contact`),
          axios.get(`${API_BASE_URL}/api/footer-sections`),
          axios.get(`${API_BASE_URL}/api/settings/general`),
          axios.get(`${API_BASE_URL}/api/legal`)
        ]);

        const formatLink = (link: string) => {
          if (!link || link.startsWith('http') || link.startsWith('/') || link.startsWith('#')) return link;
          return `#${link}`;
        };

        setFooterContent(contentRes.data);
        setQuickLinks(quickLinksRes.data
          .filter((l: any) => l.enabled)
          .map((l: any) => ({ ...l, url: formatLink(l.url) }))
        );
        setFooterContact(contactRes.data);
        setFooterSections(sectionsRes.data
          .filter((s: any) => s.enabled)
          .map((s: any) => ({
            ...s,
            links: s.links.map((l: any) => ({ ...l, href: formatLink(l.href) }))
          }))
        );
        setGeneralSettings(generalRes.data);
        setLegalPages(legalRes.data.filter((p: any) => p.status === 'published'));
      } catch (error) {
        console.error('Error fetching footer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  if (loading) {
    return (
      <footer className="bg-[#1A1C20] py-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
      </footer>
    );
  }

  return (
    <footer className="relative bg-gradient-to-br from-[#2A2D33] via-[#1A1C20] to-[#2A2D33] text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(136,136,136,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(136,136,136,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* About Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6">
                <img
                  src={generalSettings?.logoUrl ? `${API_BASE_URL}${generalSettings.logoUrl}` : "figma:asset/c4cd0f731adca963ac419fbf6c2297a5d87d3404.png"}
                  alt={generalSettings?.siteTitle || "Raju & Prasad"}
                  className="h-12 w-auto brightness-0 invert object-contain"
                />
              </div>
              <p className="text-[var(--secondary)] leading-relaxed mb-6">
                {footerContent?.description || 'Raju and Prasad is one of the firms of Chartered Accountants in Hyderabad with experienced & dedicated Chartered Accountant Professionals.'}
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                {footerContent?.socialMedia && Object.entries(footerContent.socialMedia).map(([key, url]: [string, any]) => {
                  if (!url) return null;
                  const Icon = iconMap[key.toLowerCase()] || Facebook;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[var(--secondary)]/20 hover:bg-[var(--primary)] flex items-center justify-center transition-all hover:scale-110"
                      aria-label={key}
                    >
                      <Icon className="h-5 w-5 text-[var(--secondary)] hover:text-white transition-colors" />
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-6 text-white text-uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link._id}>
                    <a
                      href={link.url}
                      className="text-[var(--secondary)] hover:text-[var(--primary)] transition-colors inline-flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-[var(--primary)] mr-0 group-hover:mr-2 transition-all duration-300" />
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Dynamic Footer Sections */}
            {footerSections.map((section, idx) => (
              <motion.div
                key={section._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + (idx * 0.1) }}
              >
                <h3 className="text-xl font-bold mb-6 text-white text-uppercase tracking-wider">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link: any, lIdx: number) => (
                    <li key={lIdx}>
                      <a
                        href={link.href}
                        className="text-[var(--secondary)] hover:text-[var(--primary)] transition-colors inline-flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-[var(--primary)] mr-0 group-hover:mr-2 transition-all duration-300" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Contact Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-6 text-white text-uppercase tracking-wider">{footerContact?.sectionTitle || 'Contact Us'}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[var(--secondary)] mt-0.5 flex-shrink-0" />
                  <span className="text-[var(--secondary)] text-sm whitespace-pre-line">
                    {footerContact?.address || 'Hyderabad, India'}
                  </span>
                </li>
                {footerContact?.phone && (
                  <li className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[var(--secondary)] flex-shrink-0" />
                    <a href={`tel:${footerContact.phone.replace(/\s/g, '')}`} className="text-[var(--secondary)] hover:text-[var(--primary)] transition-colors text-sm">
                      {footerContact.phone}
                    </a>
                  </li>
                )}
                {footerContact?.email && (
                  <li className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[var(--secondary)] flex-shrink-0" />
                    <a href={`mailto:${footerContact.email}`} className="text-[var(--secondary)] hover:text-[var(--primary)] transition-colors text-sm">
                      {footerContact.email}
                    </a>
                  </li>
                )}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--secondary)]/20">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[var(--secondary)] text-sm text-center md:text-left">
                {footerContent?.copyright || 'Raju & Prasad'}.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {legalPages.map((page) => (
                  <a
                    key={page._id}
                    href={`#${page.pageSlug.startsWith('/') ? page.pageSlug.slice(1) : page.pageSlug}`}
                    className="text-[var(--secondary)] hover:text-[var(--primary)] text-sm transition-colors"
                  >
                    {page.pageTitle}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
