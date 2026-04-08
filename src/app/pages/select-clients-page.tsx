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

// Helper to resolve image URLs reliably
const resolveImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

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
  backgroundImage: string;
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--primary)] font-semibold">Loading clients portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section
        className="relative overflow-hidden w-full aspect-[1920/375] bg-cover bg-center bg-no-repeat flex items-center" style={{
          backgroundImage: intro?.backgroundImage ? `url(${resolveImageUrl(intro.backgroundImage)})` : 'none',
          backgroundColor: !intro?.backgroundImage ? 'transparent' : 'inherit'
        }}
      >
        {!intro?.backgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-white via-[rgba(var(--primary-rgb),0.05)] to-gray-50/20" />
        )}

        {/* Overlay if there is a background image to ensure text readability */}
        {intro?.backgroundImage && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]" />
        )}

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            {/* Breadcrumb */}
            <div className={`flex items-center gap-2 text-m mb-6 ${intro?.backgroundImage ? 'text-gray-300' : 'text-[var(--secondary)]'}`}>
              <a href="#home" className={`transition-colors hover:text-white`}>Home</a>
              <ChevronRight className="h-4 w-4" />
              <span className={intro?.backgroundImage ? 'text-white font-semibold' : 'text-[var(--primary)] font-semibold'}>Select Clients</span>
            </div>
            {/* Title */}
            {/* <h1 className={`text-5xl lg:text-6xl font-bold mb-6 ${intro?.backgroundImage ? 'text-white' : 'text-[var(--primary)]'}`}>
                {intro?.title || 'Newsletter'}
              </h1> */}

            {/* Subtitle */}
            {/* <p className={`text-lg lg:text-xl leading-relaxed ${intro?.backgroundImage ? 'text-gray-200' : 'text-[var(--secondary)]'}`}>
                {intro?.subtitle || 'Subscribe to our Newsletter to get latest news and important updates on tax and regulatory laws in India on your email.'}
              </p> */}
          </motion.div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl" />
        </div>


      </section>

      {/* Intro Content */}
      {intro?.introEnabled !== false && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              <div className="relative bg-background rounded-3xl p-10 shadow-lg border border-gray-100 overflow-hidden">
                {/* Accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--primary)] to-blue-400" />

                <div className="pl-6">
                  <p className="text-lg text-white leading-relaxed mb-4">
                    {intro?.introDescription1 || "The Firm represents a diversified portfolio of clients across various sectors including Industrial, Service, Public Sector Undertakings, Banking & Insurance, Social Sector, High Net-worth Individuals (HNI), and Non-Resident Indians (NRI)."}
                  </p>
                  <p className="text-lg text-white leading-relaxed">
                    {intro?.introDescription2}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Client Categories Section */}
      <section className="py-5 bg-background">
        <div className="container mx-auto px-6">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm font-semibold inline-block mb-4">
              {intro?.introTitle || 'Our Portfolio'}
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Client <span className="text-[var(--primary)]">Categories</span>
            </h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Explore our diverse client base across specialized sectors
            </p>
          </motion.div>

          {sectors.length > 0 && (
            <div className="max-w-7xl mx-auto py-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* Left Side: Radial Infographic */}
                <div className="relative h-[500px] flex items-center justify-center hidden lg:flex sticky top-24 self-start">
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Central Hub */}
                    <div className="w-48 h-48 rounded-full bg-[#1F1F1F] border-4 border-gray-700 shadow-2xl flex items-center justify-center z-20">
                      <span className="text-white text-xl font-bold">Our Clients</span>
                    </div>

                    {/* Orbiting Sector Bubbles */}
                    {sectors.map((sector, index) => {
                      const total = sectors.length;
                      const angle = (index * (360 / total) - 90) * (Math.PI / 180);
                      const radius = 220;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;

                      return (
                        <div key={sector._id} className="absolute transition-all duration-500" style={{ transform: `translate(${x}px, ${y}px)` }}>
                          {/* Radial Arrow pointing from center to bubble */}
                          <div
                            className="absolute bg-white transition-opacity duration-300 pointer-events-none"
                            style={{
                              width: '40px',
                              height: '2px',
                              top: '50%',
                              left: '50%',
                              transformOrigin: '0% 50%',
                              transform: `rotate(${angle * (180 / Math.PI) + 180}deg) translate(90px, 0)`,
                              opacity: 0.6
                            }}
                          >
                            {/* Arrow Head */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-[8px] border-l-white" />
                          </div>

                          <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setActiveCategoryId(activeCategoryId === sector._id ? null : sector._id)}
                            className="w-32 h-32 rounded-full border-2 border-white flex items-center justify-center text-center p-4 shadow-xl z-30 transition-transform"
                            style={{
                              backgroundColor: sector.color || 'var(--primary)',
                              boxShadow: activeCategoryId === sector._id ? `0 0 30px ${sector.color}` : undefined
                            }}
                          >
                            <span className="text-white text-xs font-bold leading-tight">{sector.name}</span>
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Accordion System */}
                <div className="flex flex-col gap-4">
                  {sectors.map((sector, index) => {
                    const isExpanded = activeCategoryId === sector._id;
                    const activeIndustries = sector.industries.filter(i => i.enabled);

                    return (
                      <div key={sector._id} className="flex flex-col">
                        <button
                          onClick={() => setActiveCategoryId(isExpanded ? null : sector._id)}
                          className={`group relative flex items-center gap-4 bg-[#F2F3F5] hover:bg-[#E8E9EB] transition-all rounded-r-lg overflow-hidden h-[60px]`}
                        >
                          {/* Left Color Bar */}
                          <div
                            className="w-3 h-full shrink-0"
                            style={{ backgroundColor: sector.color || 'var(--primary)' }}
                          />

                          {/* Expansion Icon Container */}
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                              {isExpanded ? (
                                <div className="w-3.5 h-[2px] bg-gray-500" />
                              ) : (
                                <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                                  <div className="absolute w-3.5 h-[2.5px] bg-gray-500 rounded-full" />
                                  <div className="absolute w-[2.5px] h-3.5 bg-gray-500 rounded-full" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Sector Name */}
                          <span className="text-gray-900 font-bold text-lg text-left flex-1">
                            {sector.name}
                          </span>
                        </button>

                        {/* Industries Sub-list */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="bg-[#F8F9FA] mx-0 border-l-4 border-dashed border-gray-200"
                            >
                              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                                {activeIndustries.map((industry, idx) => (
                                  <div key={idx} className="flex items-center gap-3 group">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sector.color }} />
                                    <span className="text-gray-700 text-base font-medium group-hover:text-black transition-colors">{industry.name}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

              </div>
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
              {/* <div className="grid md:grid-cols-3 gap-6">
                {(intro?.stats || []).filter(s => s.enabled).map((stat, idx) => (
                  <div key={idx} className="bg-[#4a4a4a] rounded-2xl p-8 shadow-lg border border-transparent text-center hover:shadow-xl transition-shadow">
                    <p className="text-5xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-white font-medium">{stat.label}</p>
                  </div>
                ))}
                {!intro && (
                  <>
                    <div className="bg-[#4a4a4a] rounded-2xl p-8 shadow-lg border border-transparent text-center hover:shadow-l transition-shadow">
                      <p className="text-5xl font-bold text-white mb-2">7</p>
                      <p className="text-white font-medium">Industry Sectors</p>
                    </div>
                    <div className="bg-[#4a4a4a] rounded-2xl p-8 shadow-lg border border-transparent text-center hover:shadow-xl transition-shadow">
                      <p className="text-5xl font-bold text-white mb-2">76+</p>
                      <p className="text-white font-medium">Service Categories</p>
                    </div>
                    <div className="bg-[#4a4a4a] rounded-2xl p-8 shadow-lg border border-transparent text-center hover:shadow-xl transition-shadow">
                      <p className="text-5xl font-bold text-white mb-2">46+</p>
                      <p className="text-white font-medium">Years of Trust</p>
                    </div>
                  </>
                )}
              </div> */}
            </motion.div>
          )}
        </div>
      </section>


      <ScrollToTop />
    </div>
  );
}

