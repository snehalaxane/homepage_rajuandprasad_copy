import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface NavbarProps {
  activePage?: string;
}

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  _id?: string;
  label: string;
  href: string;
  dropdown?: DropdownItem[];
  enabled?: boolean;
}

export function ModernNavbar({ activePage = 'home' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [generalSettings, setGeneralSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [navRes, settingsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/navbar`),
          axios.get(`${API_BASE_URL}/api/settings/general`)
        ]);

        const allItems = navRes.data;
        const enabledItems = allItems.filter((i: any) => i.enabled);

        // Reconstruct hierarchy
        const rootItems = enabledItems.filter((i: any) => !i.parentId);
        const transformed: NavItem[] = rootItems.map((root: any) => {
          const children = enabledItems.filter((i: any) => i.parentId === root._id);

          const formatLink = (link: string) => {
            if (link.startsWith('http') || link.startsWith('/') || link.startsWith('#')) return link;
            return `#${link}`;
          };

          return {
            _id: root._id,
            label: root.label,
            href: formatLink(root.link),
            dropdown: children.length > 0 ? children.map((c: any) => ({
              label: c.label,
              href: formatLink(c.link)
            })) : undefined
          };
        });

        setNavItems(transformed);
        setGeneralSettings(settingsRes.data);
      } catch (err) {
        console.error('Error fetching navbar data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);

    // 1. Handle External Links or Full Paths
    if (href.startsWith('http') || href.startsWith('/')) {
      window.location.href = href;
      return;
    }

    // 2. Map Keywords to Dedicated Page Hashes
    const dedicatedPages: { [key: string]: string } = {
      'team': 'team',
      'history': 'history',
      'clients': 'clients',
      'services': 'services',
      'networking': 'networking',
      'newsletter': 'newsletter',
      'blog': 'blog',
      'alumni': 'alumni',
      'careers': 'careers',
      'gallery': 'gallery',
      'contact': 'contact',
    };

    // Normalize href by removing leading # for comparison
    const cleanHref = href.startsWith('#') ? href.slice(1) : href;
    const targetHash = `#${cleanHref}`;

    // 3. Navigation Logic
    if (dedicatedPages[cleanHref]) {
      // It's a dedicated page (e.g., 'team' or '#team')
      window.location.hash = dedicatedPages[cleanHref];
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // It's likely a section on the home page (e.g., 'pavilion' or '#pavilion')
      const currentHash = window.location.hash || '#home';
      const isCurrentlyOnDedicatedPage = currentHash !== '#home' && currentHash !== '#' &&
        ['team', 'history', 'clients', 'services', 'networking', 'newsletter', 'blog', 'alumni', 'careers', 'gallery', 'contact'].includes(currentHash.slice(1));

      if (isCurrentlyOnDedicatedPage) {
        // Go back to home page first
        window.location.hash = cleanHref; // Set hash to the section
        setTimeout(() => {
          const element = document.querySelector(targetHash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else if (targetHash === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 200);
      } else {
        // Already on home page, update hash and scroll
        window.location.hash = cleanHref;
        const element = document.querySelector(targetHash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (targetHash === '#home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  };

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#022683] h-20 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white animate-spin" />
      </nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-[#022683] shadow-[0_8px_30px_rgba(0,0,0,0.4)] border-b border-white/20'
        : 'bg-[#022683] shadow-[0_8px_30px_rgba(0,0,0,0.25)] border-b border-white/12'
        }`}
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="#home"
            className="flex items-center flex-shrink-0 relative z-10"
            whileHover={{ scale: 1.05 }}
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = 'home';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              filter: 'drop-shadow(0 2px 6px rgba(255,255,255,0.25))'
            }}
          >
            <img
              src={generalSettings?.logoUrl ? `${API_BASE_URL}${generalSettings.logoUrl}` : "figma:asset/c4cd0f731adca963ac419fbf6c2297a5d87d3404.png"}
              alt={generalSettings?.siteTitle || "Raju & Prasad"}
              className="h-14 w-auto brightness-0 invert object-contain"
            />
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center justify-center flex-1 px-12">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  (activePage === 'team' && item.href === '#team') ||
                  (activePage === 'history' && item.href === '#history') ||
                  (activePage === 'clients' && item.href === '#clients') ||
                  (activePage === 'services' && item.href === '#services') ||
                  (activePage === 'networking' && item.href === '#networking') ||
                  (activePage === 'newsletter' && item.href === '#think-tank') ||
                  (activePage === 'blog' && item.href === '#think-tank') ||
                  (activePage === 'alumni' && item.href === '#think-tank') ||
                  (activePage === 'careers' && item.href === '#careers') ||
                  (activePage === 'gallery' && item.href === '#gallery') ||
                  (activePage === 'contact' && item.href === '#contact') ||
                  (activePage === 'home' && item.href === '#home');

                if (item.dropdown) {
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        className={`relative text-sm font-semibold tracking-wide transition-all duration-200 px-4 py-2 rounded-lg group whitespace-nowrap flex items-center gap-1 text-white ${isActive
                          ? 'bg-white/10'
                          : 'hover:bg-white/5'
                          }`}
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                        {/* Underline Animation - White accent */}
                        <motion.span
                          className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-white rounded-full ${isActive ? 'w-[60%]' : 'w-0'}`}
                          whileHover={{ width: '60%' }}
                          transition={{ duration: 0.2 }}
                        />
                      </button>

                      <AnimatePresence>
                        {openDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-48 bg-[#022683] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-white/12 overflow-hidden z-50"
                          >
                            {item.dropdown.map((dropdownItem, index) => {
                              const isDropdownActive =
                                (activePage === 'newsletter' && dropdownItem.href === '#newsletter') ||
                                (activePage === 'blog' && dropdownItem.href === '#blog') ||
                                (activePage === 'alumni' && dropdownItem.href === '#alumni');

                              return (
                                <motion.a
                                  key={dropdownItem.label}
                                  href={dropdownItem.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleNavClick(dropdownItem.href);
                                  }}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2, delay: index * 0.05 }}
                                  className={`block px-4 py-3 text-sm font-semibold text-white transition-all ${isDropdownActive
                                    ? 'bg-white/20 border-l-2 border-white'
                                    : 'hover:bg-white/10'
                                    }`}
                                >
                                  {dropdownItem.label}
                                </motion.a>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={`relative text-sm font-semibold tracking-wide transition-all duration-200 px-4 py-2 rounded-lg group whitespace-nowrap text-white ${isActive
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                      }`}
                  >
                    {item.label}
                    {/* Underline Animation - White accent */}
                    <motion.span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-white rounded-full ${isActive ? 'w-[60%]' : 'w-0'}`}
                      whileHover={{ width: '60%' }}
                      transition={{ duration: 0.2 }}
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-[#022683] border-t border-white/12 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
          >
            <div className="container mx-auto px-6 py-6 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive =
                    (activePage === 'team' && item.href === '#team') ||
                    (activePage === 'history' && item.href === '#history') ||
                    (activePage === 'clients' && item.href === '#clients') ||
                    (activePage === 'services' && item.href === '#services') ||
                    (activePage === 'networking' && item.href === '#networking') ||
                    (activePage === 'newsletter' && item.href === '#think-tank') ||
                    (activePage === 'blog' && item.href === '#think-tank') ||
                    (activePage === 'alumni' && item.href === '#think-tank') ||
                    (activePage === 'careers' && item.href === '#careers') ||
                    (activePage === 'gallery' && item.href === '#gallery') ||
                    (activePage === 'contact' && item.href === '#contact') ||
                    (activePage === 'home' && item.href === '#home');

                  if (item.dropdown) {
                    return (
                      <div key={item.label}>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                          className={`w-full py-3 px-4 rounded-lg transition-all font-semibold flex items-center justify-between text-white ${isActive
                            ? 'bg-white/20 border-l-2 border-white'
                            : 'hover:bg-white/10'
                            }`}
                        >
                          {item.label}
                          <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {openDropdown === item.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-4 mt-2 space-y-2"
                            >
                              {item.dropdown.map((dropdownItem) => {
                                const isDropdownActive =
                                  (activePage === 'newsletter' && dropdownItem.href === '#newsletter') ||
                                  (activePage === 'blog' && dropdownItem.href === '#blog') ||
                                  (activePage === 'alumni' && dropdownItem.href === '#alumni');

                                return (
                                  <a
                                    key={dropdownItem.label}
                                    href={dropdownItem.href}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleNavClick(dropdownItem.href);
                                    }}
                                    className={`block py-2 px-4 rounded-lg transition-all font-semibold text-sm text-white ${isDropdownActive
                                      ? 'bg-white/20 border-l-2 border-white'
                                      : 'hover:bg-white/10'
                                      }`}
                                  >
                                    {dropdownItem.label}
                                  </a>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className={`py-3 px-4 rounded-lg transition-all font-semibold text-white ${isActive
                        ? 'bg-white/20 border-l-2 border-white'
                        : 'hover:bg-white/10'
                        }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}