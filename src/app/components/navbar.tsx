import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

interface NavbarProps {
  activePage?: string;
}

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  { label: 'Pavilion', href: '#pavilion' },
  { label: 'The Team', href: '#team' },
  { label: 'History', href: '#history' },
  { label: 'Select Clients', href: '#clients' },
  { label: 'Services', href: '#services' },
  { label: 'Networking', href: '#networking' },
  {
    label: 'Think Tank',
    href: '#think-tank',
    dropdown: [
      { label: 'Newsletter', href: '#newsletter' },
      { label: 'Our Blog', href: '#blog' },
      { label: 'Alumni', href: '#alumni' },
    ]
  },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Careers', href: '#careers' },
  { label: 'Contact Us', href: '#contact' },
];

export function Navbar({ activePage = 'home' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

    // Special handling for dedicated pages
    const dedicatedPageRoutes: { [key: string]: string } = {
      '#team': 'team',
      '#history': 'history',
      '#clients': 'clients',
      '#services': 'services',
      '#networking': 'networking',
      '#newsletter': 'newsletter',
      '#blog': 'blog',
      '#alumni': 'alumni',
      '#careers': 'careers',
      '#gallery': 'gallery',
      '#contact': 'contact',
    };

    if (dedicatedPageRoutes[href]) {
      window.location.hash = dedicatedPageRoutes[href];
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // For other items, if on dedicated pages, go back to home first
    const dedicatedPages = ['#team', '#history', '#clients', '#services', '#networking', '#newsletter', '#blog', '#alumni'];
    if (dedicatedPages.includes(window.location.hash)) {
      window.location.hash = 'home';
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white shadow-xl border-b border-gray-100'
          : 'bg-white shadow-md'
        }`}
    >
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="#home"
            className="flex items-center flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = 'home';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src="figma:asset/c4cd0f731adca963ac419fbf6c2297a5d87d3404.png"
              alt="Raju & Prasad"
              className="h-14 w-auto"
            />
          </motion.a>

          {/* Desktop Navigation - Centered */}
          <div className="hidden xl:flex items-center justify-center flex-1 px-12">
            <div className="flex items-center gap-6">
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

                // Check if this item has a dropdown
                if (item.dropdown) {
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        className={`relative text-sm font-semibold tracking-wide transition-all duration-300 px-3 py-2 group whitespace-nowrap flex items-center gap-1 ${isActive ? 'text-[var(--primary)]' : 'text-[var(--secondary)] hover:text-[var(--primary)]'
                          }`}
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                        <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] transition-all duration-300 rounded-full ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                          }`}></span>
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {openDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
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
                                  className={`block px-4 py-3 text-sm font-semibold transition-all ${isDropdownActive
                                      ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                                      : 'text-[var(--secondary)] hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]'
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
                    className={`relative text-sm font-semibold tracking-wide transition-all duration-300 px-3 py-2 group whitespace-nowrap ${isActive ? 'text-[var(--primary)]' : 'text-[var(--secondary)] hover:text-[var(--primary)]'
                      }`}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] transition-all duration-300 rounded-full ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                      }`}></span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
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
            className="xl:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="container mx-auto px-6 py-6 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col gap-4">
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

                  // If item has dropdown
                  if (item.dropdown) {
                    return (
                      <div key={item.label}>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                          className={`w-full py-3 px-4 rounded-lg transition-all font-semibold flex items-center justify-between ${isActive
                              ? 'text-[var(--primary)] bg-[var(--primary)]/5'
                              : 'text-[var(--secondary)] hover:text-[var(--primary)] hover:bg-gray-50'
                            }`}
                        >
                          {item.label}
                          <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Mobile Dropdown */}
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
                                    className={`block py-2 px-4 rounded-lg transition-all font-semibold text-sm ${isDropdownActive
                                        ? 'text-[var(--primary)] bg-[var(--primary)]/5'
                                        : 'text-[var(--secondary)] hover:text-[var(--primary)] hover:bg-gray-50'
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
                      className={`py-3 px-4 rounded-lg transition-all font-semibold ${isActive
                          ? 'text-[var(--primary)] bg-[var(--primary)]/5'
                          : 'text-[var(--secondary)] hover:text-[var(--primary)] hover:bg-gray-50'
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
