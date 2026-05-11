import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight, Filter, ArrowUpDown, Briefcase, Building2, User } from 'lucide-react';
import { ScrollToTop } from '../components/scroll-to-top';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface AlumniIntro {
  title: string;
  subtitle: string;
  enabled: boolean;
  backgroundImage: string;
}

// Helper to resolve image URLs reliably
const resolveImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

interface Alumni {
  _id: string;
  name: string;
  designation: string;
  company: string;
  industry: string;
  image?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export function AlumniPage() {
  const [alumniData, setAlumniData] = useState<Alumni[]>([]);
  const [intro, setIntro] = useState<AlumniIntro | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [sortOrder, setSortOrder] = useState('A-Z');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [introRes, alumniRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/alumni-intro`),
          fetch(`${API_BASE_URL}/api/alumni`)
        ]);

        if (introRes.ok) setIntro(await introRes.json());
        if (alumniRes.ok) {
          const data = await alumniRes.json();
          setAlumniData(data.filter((alum: Alumni) => alum.enabled));
        }
      } catch (error) {
        console.error("Error fetching alumni data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get unique industries
  const industries = ['All', ...Array.from(new Set(alumniData.map(alumni => alumni.industry).filter(Boolean)))];

  // Filter and sort alumni
  let filteredAlumni = alumniData.filter(alumni => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.designation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry = selectedIndustry === 'All' || alumni.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  // Sort alumni
  if (sortOrder === 'A-Z') {
    filteredAlumni = [...filteredAlumni].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === 'Z-A') {
    filteredAlumni = [...filteredAlumni].sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortOrder === 'Recent') {
    // Basic sort by ID as proxy for recent if createdAt isn't available
    filteredAlumni = [...filteredAlumni].reverse();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--primary)] font-semibold">Loading alumni profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section
          className="relative overflow-hidden w-full aspect-[1920/375] bg-cover bg-center bg-no-repeat flex items-center" style={{
            backgroundImage: intro?.backgroundImage ? `url(${resolveImageUrl(intro.backgroundImage)})` : 'none',
            backgroundColor: !intro?.backgroundImage ? 'transparent' : 'inherit'
          }}
        >
          {!intro?.backgroundImage && (
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-blue-50/20" />
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
            >
              {/* Breadcrumb */}
              {/* <div className={`flex items-center gap-2 text-m mb-6 ${intro?.backgroundImage ? 'text-gray-300' : 'text-[var(--secondary)]'}`}>
                <a href="#home" className={`transition-colors hover:text-white`}>Home</a>
                <ChevronRight className="h-4 w-4" />
                <span className={intro?.backgroundImage ? 'text-white font-semibold' : 'text-[var(--primary)] font-semibold'}>Alumni</span>
              </div> */}

              {/* Title & Subtitle - Respecting the enabled flag */}
              {intro?.enabled !== false && (
                <>
                  {/* <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${intro?.backgroundImage ? 'text-white' : 'text-[var(--primary)]'}`}>
                    {intro?.title || 'Our Alumni Students are spread across Industry Segments.'}
                  </h1> */}

                  {/* <div className={`space-y-4 text-lg max-w-2xl whitespace-pre-wrap ${intro?.backgroundImage ? 'text-gray-200' : 'text-[var(--secondary)]'}`}>
                    {intro?.subtitle ? (
                      <p>{intro.subtitle}</p>
                    ) : (
                      <>
                        <p>
                          Over the years, Raju and Prasad has produced over 200 Chartered Accountants who are serving the industry and profession in India and abroad.
                        </p>
                        <p>
                          Raju and Prasad's Alumni network is intended to connect and bond with the R&P Family. Rediscover old friends, seek and offer help and stay connected with the Raju and Prasad Family through the Alumni network.
                        </p>
                      </>
                    )}
                  </div> */}
                </>
              )}
            </motion.div>
          </div>
        </section>

        <div className="w-full bg-background border-t-4 border-[var(--primary)]">
          <div className="container mx-auto px-6 py-4">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-m text-white">
              <a href="/" className="hover:text-white">Home</a>
              {/* <span className="text-black text-xl">›</span> */}
              <span className="text-black text-2xl">›</span>
              <span className="text-white font-semibold">Alumni</span>
            </div>

          </div>

          {/* White bottom line */}
          <div className="w-full h-[2px] bg-white"></div>
        </div>


        {/* Alumni Section */}
        <section className="py-12">
          <div className="container mx-auto px-6">

            {/* Breadcrumb */}
            {/* <div className="flex items-center gap-2 text-sm text-gray-300 mb-12 border-b border-white/10 pb-4">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white font-medium">Alumni</span>
            </div> */}

            {/* Title & Introduction from Admin Panel */}
            {intro?.enabled !== false && (intro?.title || intro?.subtitle) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 max-w-7xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight leading-tight">
                  {intro?.title}
                </h2>

                <div className="text-xl font-semibold text-white leading-relaxed space-y-4 text-justify">
                  {intro?.subtitle ? (
                    <div className="whitespace-pre-wrap">{intro.subtitle}</div>
                  ) : (
                    <>

                    </>
                  )}
                </div>
              </motion.div>
            )}

            <div className="flex flex-col lg:flex-row gap-4 items-center">
            </div>


            {/* Alumni Grid */}
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAlumni.map((alumni, index) => (
                <motion.div
                  key={alumni._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 border-l-4 border-l-[var(--primary)] overflow-hidden transition-all group"
                >
                  <div className="p-6">
                    {/* Header Icon */}
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {alumni.image ? (
                        <img
                          src={resolveImageUrl(alumni.image)}
                          alt={alumni.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-7 w-7 text-gray-400" />
                      )}
                    </div>

                    {/* Name */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-[var(--secondary)] uppercase tracking-wider mb-1">
                        Name
                      </p>
                      <h3 className="text-xl font-bold text-[var(--primary)] group-hover:text-[#002855] transition-colors">
                        {alumni.name}
                      </h3>
                    </div>

                    {/* Company */}
                    <div className="mb-4">
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-[var(--secondary)] mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-[var(--secondary)] uppercase tracking-wider mb-1">
                            Company
                          </p>
                          <p className="text-base font-semibold text-gray-900">
                            {alumni.company}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Designation */}
                    <div className="mb-4">
                      <div className="flex items-start gap-2">
                        <Briefcase className="h-4 w-4 text-[var(--secondary)] mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-[var(--secondary)] uppercase tracking-wider mb-1">
                            Designation
                          </p>
                          <p className="text-base font-semibold text-gray-900">
                            {alumni.designation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Industry Tag */}
                    {alumni.industry && (
                      <div className="pt-4 border-t border-gray-100">
                        <span className="inline-flex items-center px-3 py-1 bg-[var(--primary)]/5 text-[var(--primary)] text-xs font-semibold rounded-full">
                          {alumni.industry}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* No Results */}
            {filteredAlumni.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-[var(--secondary)]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No alumni found
                </h3>
                <p className="text-[var(--secondary)] mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndustry('All');
                  }}
                  className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[#002855] transition-all"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <ScrollToTop />
    </>
  );
}

