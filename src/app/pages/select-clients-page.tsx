import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  Factory,
  Briefcase,
  Building2,
  Landmark,
  Heart,
  User,
  Globe,
  Check
} from 'lucide-react';
import { ScrollToTop } from '../components/scroll-to-top';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Icon mapping
const iconMap: Record<string, any> = {
  Factory,
  Briefcase,
  Building2,
  Landmark,
  Heart,
  User,
  Globe
};

interface Industry {
  name: string;
  enabled: boolean;
}

interface Sector {
  _id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
  industries: Industry[];
  order: number;
}

interface PageIntro {
  title: string;
  subtitle: string;
  introTitle: string;
  introDescription1: string;
  introDescription2: string;
  stats: Array<{ label: string, value: string, enabled: boolean }>;
  introEnabled: boolean;
  statsEnabled: boolean;
  enabled: boolean;
}

export function SelectClientsPage() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [intro, setIntro] = useState<PageIntro | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [introRes, sectorsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/select-clients-intro`),
          fetch(`${API_BASE_URL}/api/sectors`)
        ]);

        if (introRes.ok) setIntro(await introRes.json());
        if (sectorsRes.ok) {
          const data = await sectorsRes.json();
          const activeSectors = data.filter((s: Sector) => s.enabled);
          setSectors(activeSectors);
          if (activeSectors.length > 0) {
            setActiveCategoryId(activeSectors[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching select clients data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentCategory = sectors.find(s => s._id === activeCategoryId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#022683] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#022683] font-semibold">Loading clients portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-gray-50/20 pt-25 pb-10  border-b border-gray-100">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-[#022683]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-[#022683]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-sm text-[#888888] mb-6">
              <a href="#home" className="hover:text-[#022683] transition-colors">
                Home
              </a>
              <ChevronRight className="h-4 w-4" />
              <span className="text-[#022683] font-medium">Select Clients</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {intro?.title.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? "text-[#022683]" : ""}>{word} </span>
              )) || (
                  <>Select <span className="text-[#022683]">Clients</span></>
                )}
            </h1>

            <p className="text-xl text-[#888888] leading-relaxed max-w-2xl mx-auto">
              {intro?.subtitle || 'Serving clients across diverse industries with trust and commitment.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro Content */}
      {intro?.introEnabled !== false && (
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
                {/* Accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#022683] to-blue-400" />

                <div className="pl-6">
                  <p className="text-lg text-[#888888] leading-relaxed mb-4">
                    {intro?.introDescription1 || "The Firm represents a diversified portfolio of clients across various sectors including Industrial, Service, Public Sector Undertakings, Banking & Insurance, Social Sector, High Net-worth Individuals (HNI), and Non-Resident Indians (NRI)."}
                  </p>
                  <p className="text-lg text-[#888888] leading-relaxed">
                    {intro?.introDescription2 || "Our expertise spans multiple industries and we take pride in delivering customized solutions to meet the unique needs of each client segment."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Client Categories Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
        <div className="container mx-auto px-6">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="px-4 py-2 bg-[#022683]/10 text-[#022683] rounded-full text-sm font-semibold inline-block mb-4">
              {intro?.introTitle || 'Our Portfolio'}
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Client <span className="text-[#022683]">Categories</span>
            </h2>
            <p className="text-lg text-[#888888] max-w-2xl mx-auto">
              Explore our diverse client base across specialized sectors
            </p>
          </motion.div>

          {sectors.length > 0 && (
            <div className="max-w-7xl mx-auto">
              {/* Category Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-3 mb-12"
              >
                {sectors.map((category, index) => {
                  const Icon = iconMap[category.icon] || Factory;
                  const isActive = activeCategoryId === category._id;
                  const activeItemsCount = category.industries.filter(i => i.enabled).length;

                  return (
                    <motion.button
                      key={category._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveCategoryId(category._id)}
                      className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all ${isActive
                        ? 'bg-[#022683] text-white shadow-lg shadow-[#022683]/30'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-[#022683] hover:text-[#022683] shadow-md'
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="hidden sm:inline">{category.name}</span>
                      <span className="inline sm:hidden">{category.name.split(' ')[0]}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {activeItemsCount}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Category Content */}
              <AnimatePresence mode="wait">
                {currentCategory && (
                  <motion.div
                    key={currentCategory._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                      {/* Category Header */}
                      <div className={`bg-gradient-to-r ${currentCategory.color || 'from-blue-500 to-indigo-600'} p-8 text-white`}>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            {(() => {
                              const Icon = iconMap[currentCategory.icon] || Factory;
                              return <Icon className="h-8 w-8" />;
                            })()}
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold">{currentCategory.name}</h3>
                            <p className="text-white/80 mt-1">
                              {currentCategory.industries.filter(i => i.enabled).length} specialized areas
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Category Items Grid */}
                      <div className="p-8 lg:p-12">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {currentCategory.industries.filter(i => i.enabled).map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.03 }}
                              className="group flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:from-[#022683]/5 hover:to-blue-50 transition-all hover:shadow-md border border-transparent hover:border-[#022683]/20"
                            >
                              <div className="mt-1 w-5 h-5 rounded-full bg-[#022683]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#022683] transition-colors">
                                <Check className="h-3 w-3 text-[#022683] group-hover:text-white transition-colors" />
                              </div>
                              <span className="text-gray-700 font-medium group-hover:text-[#022683] transition-colors leading-snug">
                                {item.name}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Stats Section */}
          {intro?.statsEnabled !== false && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto mt-16"
            >
              <div className="grid md:grid-cols-3 gap-6">
                {(intro?.stats || []).filter(s => s.enabled).map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                    <p className="text-5xl font-bold text-[#022683] mb-2">{stat.value}</p>
                    <p className="text-[#888888] font-medium">{stat.label}</p>
                  </div>
                ))}
                {!intro && (
                  <>
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                      <p className="text-5xl font-bold text-[#022683] mb-2">7</p>
                      <p className="text-[#888888] font-medium">Industry Sectors</p>
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                      <p className="text-5xl font-bold text-[#022683] mb-2">76+</p>
                      <p className="text-[#888888] font-medium">Service Categories</p>
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                      <p className="text-5xl font-bold text-[#022683] mb-2">46+</p>
                      <p className="text-[#888888] font-medium">Years of Trust</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative bg-gradient-to-br from-[#022683] to-blue-600 rounded-3xl p-12 lg:p-16 shadow-2xl shadow-[#022683]/20 overflow-hidden text-center">
              {/* Decorative Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Ready to join our prestigious client base?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Let our experienced team provide tailored solutions for your business needs
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#022683] rounded-full hover:bg-gray-100 transition-all shadow-lg font-semibold"
                  >
                    Get Started Today
                    <ChevronRight className="h-5 w-5" />
                  </motion.a>

                  <motion.a
                    href="#services"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-full hover:bg-white/20 transition-all font-semibold"
                  >
                    View Our Services
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}
