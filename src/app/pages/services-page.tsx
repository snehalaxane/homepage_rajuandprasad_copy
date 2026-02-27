import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  FileCheck,
  Calculator,
  TrendingUp,
  DollarSign,
  FileText,
  Search,
  CheckCircle2,
  Building2,
  Landmark,
  FileSignature,
  Users,
  Globe,
  RefreshCw,
  Wallet,
  Target,
  Briefcase,
  Shield,
  ClipboardList,
  Loader2
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Icon mapping for dynamic icons from backend
const iconMap: Record<string, any> = {
  FileCheck,
  Calculator,
  TrendingUp,
  DollarSign,
  FileText,
  Search,
  CheckCircle2,
  Building2,
  Landmark,
  FileSignature,
  Users,
  Globe,
  RefreshCw,
  Wallet,
  Target,
  Briefcase,
  Shield,
  ClipboardList
};

export function ServicesPage() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [introData, setIntroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, introRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/services`),
          axios.get(`${API_BASE_URL}/api/service-intro`)
        ]);

        const activeServices = servicesRes.data.filter((s: any) => s.enabled);
        setServices(activeServices);
        setIntroData(introRes.data);

        // Check hash for deep linking
        const hash = window.location.hash.slice(1);
        if (hash && activeServices.length > 0) {
          const matchedService = activeServices.find((s: any) =>
            s.slug === hash || s.slug === `/${hash}` || s.slug === `services/${hash}`
          );
          if (matchedService) {
            setActiveService(matchedService._id);
          } else {
            setActiveService(activeServices[0]._id);
          }
        } else if (activeServices.length > 0) {
          setActiveService(activeServices[0]._id);
        }
      } catch (error) {
        console.error('Error fetching services data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Listen for hash changes while on the page
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && services.length > 0) {
        const matchedService = services.find((s: any) =>
          s.slug === hash || s.slug === `/${hash}` || s.slug === `services/${hash}`
        );
        if (matchedService) {
          setActiveService(matchedService._id);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [services.length]); // Re-run if services list is updated

  const currentService = services.find((cat) => cat._id === activeService);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  // If page is disabled, you might want to show a 404 or something, 
  // but for now we'll just check if it's enabled.
  if (introData && introData.enabled === false) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Unavailable</h1>
          <p className="text-gray-600">This page is currently being updated. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-gray-50/20 pt-25 pb-10 border-b border-gray-100">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-sm text-[var(--secondary)] mb-6">
              <a href="/" className="hover:text-[var(--primary)] transition-colors">
                Home
              </a>
              <ChevronRight className="h-4 w-4" />
              <span className="text-[var(--primary)] font-medium">Services</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              <span className="text-[var(--primary)]">{introData?.title || 'Services'}</span>
            </h1>

            <p className="text-xl text-[var(--secondary)] leading-relaxed max-w-2xl mx-auto border-t border-[var(--primary)]/10 pt-6">
              {introData?.subtitle || 'We deliver professional services with commitment, competence and clarity.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro Text Block */}
      {introData?.introEnabled !== false && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-10 shadow-lg border border-gray-100 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--primary)] to-blue-400" />
                <div className="pl-6">
                  <p className="text-lg text-[var(--secondary)] leading-relaxed">
                    {introData?.introDescription || 'Loading description...'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Services Split Panel Layout */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Left Panel - Service Categories */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-4"
              >
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden sticky top-32">
                  <div className="p-6 bg-gradient-to-br from-[var(--primary)] to-blue-600 text-white">
                    <h3 className="text-2xl font-bold">Service Categories</h3>
                    <p className="text-white/80 text-sm mt-2">
                      Select a category to view details
                    </p>
                  </div>

                  <div className="p-4">
                    {services.map((service, index) => {
                      const Icon = iconMap[service.icon] || FileCheck;
                      const isActive = activeService === service._id;

                      return (
                        <motion.button
                          key={service._id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          onClick={() => setActiveService(service._id)}
                          className={`w-full text-left p-4 rounded-2xl mb-3 transition-all duration-300 group relative overflow-hidden ${isActive
                            ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                            }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeService"
                              className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          )}

                          <div className="flex items-start gap-3 relative z-10">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors overflow-hidden ${isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-white text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white'
                                }`}
                            >
                              {service.icon?.startsWith('data:') ? (
                                <img src={service.icon} alt="icon" className={`w-full h-full object-contain p-2 ${isActive ? 'invert' : 'group-hover:invert'}`} />
                              ) : (
                                <Icon className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`font-semibold text-sm leading-snug ${isActive ? 'text-white' : 'text-gray-900'
                                  }`}
                              >
                                {service.name}
                              </p>
                            </div>
                            <ChevronRight
                              className={`h-5 w-5 flex-shrink-0 transition-transform ${isActive ? 'text-white translate-x-1' : 'text-gray-400'
                                }`}
                            />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Right Panel - Service Details */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  {currentService && (
                    <motion.div
                      key={currentService._id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      {/* Service Header */}
                      <div className="bg-gradient-to-br from-[var(--primary)] to-blue-600 p-8 text-white">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden">
                            {currentService.icon?.startsWith('data:') ? (
                              <img src={currentService.icon} alt="icon" className="w-full h-full object-contain p-3 invert" />
                            ) : (
                              (() => {
                                const Icon = iconMap[currentService.icon] || FileCheck;
                                return <Icon className="h-8 w-8" />;
                              })()
                            )}
                          </div>
                          <h2 className="text-3xl font-bold">{currentService.title || currentService.name}</h2>
                        </div>
                      </div>

                      {/* Service Content */}
                      <div className="p-8 lg:p-10 space-y-8">
                        {currentService.subServices?.filter((s: any) => s.enabled !== false).map((section: any, index: number) => {
                          const SectionIcon = iconMap[section.icon] || CheckCircle2;

                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="group"
                            >
                              {/* Section Heading */}
                              <div className="flex items-start gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary)] group-hover:scale-110 transition-all overflow-hidden">
                                  {section.icon?.startsWith('data:') ? (
                                    <img src={section.icon} alt="icon" className="w-full h-full object-contain p-2 text-[var(--primary)] group-hover:invert transition-all" />
                                  ) : (
                                    <SectionIcon className="h-5 w-5 text-[var(--primary)] group-hover:text-white transition-colors" />
                                  )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors pt-1">
                                  {section.heading}
                                </h3>
                              </div>

                              {/* Section Content */}
                              <div className="pl-13">
                                <p className="text-[var(--secondary)] leading-relaxed whitespace-pre-line">
                                  {section.content}
                                </p>
                              </div>

                              {/* Divider */}
                              {index < currentService.subServices.length - 1 && (
                                <div className="mt-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                              )}
                            </motion.div>
                          );
                        })}
                        {(!currentService.subServices || currentService.subServices.length === 0) && (
                          <div className="text-center py-20 opacity-30 italic">
                            No detailed sections available for this category.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {introData?.ctaEnabled !== false && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative bg-gradient-to-br from-[var(--primary)] to-blue-600 rounded-3xl p-12 lg:p-16 shadow-2xl shadow-[var(--primary)]/20 overflow-hidden text-center">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative z-10">
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    {introData?.ctaTitle || 'Need professional advisory services?'}
                  </h2>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    {introData?.ctaSubtitle || 'Our team of experts is ready to provide customized solutions for your business'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <motion.a
                      href="/#contact"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--primary)] rounded-full hover:bg-gray-100 transition-all shadow-lg font-semibold"
                    >
                      Get in Touch
                      <ChevronRight className="h-5 w-5" />
                    </motion.a>

                    <motion.a
                      href="/#team"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-full hover:bg-white/20 transition-all font-semibold"
                    >
                      Meet Our Team
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

    </div>
  );
}

