import { Download, Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollToTop } from '../components/scroll-to-top';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface NewsletterIntro {
  title: string;
  subtitle: string;
  enabled: boolean;
}

interface Newsletter {
  _id: string;
  month: string;
  year: string;
  title: string;
  industryReview: string;
  otherContents: string;
  pdfFile: string;
  enabled: boolean;
}

export function NewsletterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [intro, setIntro] = useState<NewsletterIntro | null>(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [introRes, newsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/newsletter-intro`),
          fetch(`${API_BASE_URL}/api/newsletters`)
        ]);

        if (introRes.ok) setIntro(await introRes.json());
        if (newsRes.ok) {
          const data = await newsRes.json();
          setNewsletters(data.filter((n: Newsletter) => n.enabled));
        }
      } catch (error) {
        console.error("Error fetching newsletter data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const availableYears = ['All', ...Array.from(new Set(newsletters.map(n => n.year))).sort((a, b) => b.localeCompare(a))];

  // Filter data based on search and year
  const filteredData = newsletters.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.industryReview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.otherContents.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.month.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear = selectedYear === 'All' || item.year === selectedYear;

    return matchesSearch && matchesYear;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

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
              className="max-w-4xl"
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-[#888888] mb-4">
                <a href="#home" className="hover:text-[#022683] transition-colors">Home</a>
                <ChevronRight className="h-4 w-4" />
                <span className="text-[#022683] font-semibold">Newsletter</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl lg:text-6xl font-bold text-[#022683] mb-6">
                {intro?.title || 'Newsletter'}
              </h1>

              {/* Subtitle */}
              <p className="text-lg lg:text-xl text-[#888888] leading-relaxed">
                {intro?.subtitle || 'Subscribe to our Newsletter to get latest news and important updates on tax and regulatory laws in India on your email.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Newsletter List Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              {/* Table Header Controls */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#888888]" />
                    <input
                      type="text"
                      placeholder="Search month / content..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#022683] focus:outline-none transition-all text-gray-900"
                    />
                  </div>

                  {/* Year Filter */}
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="appearance-none px-6 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#022683] focus:outline-none transition-all text-gray-900 font-semibold bg-white cursor-pointer"
                    >
                      {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#888888] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#022683] to-[#033aa8] text-white sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider">
                        Editorial
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider">
                        Industry Review
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider">
                        Other Contents
                      </th>
                      <th className="px-6 py-4 text-center font-bold text-sm uppercase tracking-wider">
                        Downloads
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <motion.tr
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-[#022683]/5 hover:to-blue-50/30 transition-all ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                          }`}
                      >
                        <td className="px-6 py-5 font-semibold text-[#022683]">
                          {item.month} {item.year}
                        </td>
                        <td className="px-6 py-5 text-gray-900">
                          {item.title}
                        </td>
                        <td className="px-6 py-5 text-gray-900">
                          {item.industryReview}
                        </td>
                        <td className="px-6 py-5 text-[#888888] text-sm">
                          {item.otherContents}
                        </td>
                        <td className="px-6 py-5 text-center">
                          {item.pdfFile ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-2 border-[#022683] text-[#022683] hover:bg-[#022683] hover:text-white group transition-all"
                              asChild
                            >
                              <a href={`${API_BASE_URL}/${item.pdfFile}`} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                                Download
                              </a>
                            </Button>
                          ) : (
                            <span className="text-[#888888] italic text-sm">No PDF</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#888888]">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="border-2 border-gray-200 hover:border-[#022683] hover:bg-[#022683] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(i + 1)}
                          className={
                            currentPage === i + 1
                              ? 'bg-[#022683] hover:bg-[#011952] text-white'
                              : 'border-2 border-gray-200 hover:border-[#022683] hover:bg-[#022683] hover:text-white'
                          }
                        >
                          {i + 1}
                        </Button>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="border-2 border-gray-200 hover:border-[#022683] hover:bg-[#022683] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <ScrollToTop />
    </>
  );
}
