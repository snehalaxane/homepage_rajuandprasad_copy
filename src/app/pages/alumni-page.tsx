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
}

interface Alumni {
  _id: string;
  name: string;
  designation: string;
  company: string;
  industry: string;
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
          <div className="w-12 h-12 border-4 border-[#022683] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#022683] font-semibold">Loading alumni profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
        {/* Page Header */}
        <section className="pt-25 pb-10  bg-gradient-to-r from-[#022683]/5 to-blue-50/20 border-b border-gray-100">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto text-center"
            >
              {/* Breadcrumb */}
              <div className="flex items-center justify-center gap-2 text-sm text-[#888888] mb-6">
                <a href="#home" className="hover:text-[#022683] transition-colors">Home</a>
                <ChevronRight className="h-4 w-4" />
                <span className="hover:text-[#022683] transition-colors cursor-pointer">Think Tank</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-[#022683] font-semibold">Alumni</span>
              </div>

              {/* Title & Subtitle - Respecting the enabled flag */}
              {intro?.enabled !== false && (
                <>
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#022683] mb-8 leading-tight">
                    {intro?.title || 'Our Alumni Students are spread across Industry Segments.'}
                  </h1>

                  <div className="space-y-4 text-lg text-[#888888] leading-relaxed max-w-4xl mx-auto whitespace-pre-wrap">
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
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </section>

        {/* Alumni Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {/* Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-12"
            >
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#888888]" />
                  <input
                    type="text"
                    placeholder="Search name / company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#022683] focus:outline-none transition-all text-gray-900"
                  />
                </div>

                {/* Industry Filter */}
                <div className="relative w-full lg:w-auto min-w-[200px]">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#888888] pointer-events-none" />
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full appearance-none pl-10 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-[#022683] focus:outline-none transition-all text-gray-900 font-semibold bg-white cursor-pointer"
                  >
                    {industries.map(industry => (
                      industry && (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      )
                    ))}
                    <option value="All">All Industries</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="relative w-full lg:w-auto min-w-[180px]">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#888888] pointer-events-none" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full appearance-none pl-10 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-[#022683] focus:outline-none transition-all text-gray-900 font-semibold bg-white cursor-pointer"
                  >
                    <option value="A-Z">A - Z</option>
                    <option value="Z-A">Z - A</option>
                    <option value="Recent">Recently Added</option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-[#888888] font-semibold">
                  Showing {filteredAlumni.length} of {alumniData.length} alumni
                </p>
              </div>
            </motion.div>

            {/* Alumni Grid */}
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAlumni.map((alumni, index) => (
                <motion.div
                  key={alumni._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 border-l-4 border-l-[#022683] overflow-hidden transition-all group"
                >
                  <div className="p-6">
                    {/* Header Icon */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#022683] to-[#033aa8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <User className="h-7 w-7 text-white" />
                    </div>

                    {/* Name */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-1">
                        Name
                      </p>
                      <h3 className="text-xl font-bold text-[#022683] group-hover:text-[#011952] transition-colors">
                        {alumni.name}
                      </h3>
                    </div>

                    {/* Company */}
                    <div className="mb-4">
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-[#888888] mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-1">
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
                        <Briefcase className="h-4 w-4 text-[#888888] mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-1">
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
                        <span className="inline-flex items-center px-3 py-1 bg-[#022683]/5 text-[#022683] text-xs font-semibold rounded-full">
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
                  <Search className="h-12 w-12 text-[#888888]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No alumni found
                </h3>
                <p className="text-[#888888] mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndustry('All');
                  }}
                  className="px-6 py-3 bg-[#022683] text-white rounded-xl font-semibold hover:bg-[#011952] transition-all"
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
