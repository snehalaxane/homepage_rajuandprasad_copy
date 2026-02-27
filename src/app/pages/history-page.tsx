import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, MapPin, Calendar, Quote, ArrowRight } from 'lucide-react';
import { ScrollToTop } from '../components/scroll-to-top';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface HistoryJourney {
  sinceYear: string;
  title: string;
  description: string;
  yearsOfService: string;
  activeLocations: string;
}

interface HistoryTimeline {
  _id: string;
  title: string;
  subtitle: string;
  year: string;
  tag: string;
  order: number;
}

interface HistoryMission {
  title: string;
  content: string;
  enabled: boolean;
}

export function HistoryPage() {
  const [journey, setJourney] = useState<HistoryJourney | null>(null);
  const [timeline, setTimeline] = useState<HistoryTimeline[]>([]);
  const [mission, setMission] = useState<HistoryMission | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [journeyRes, timelineRes, missionRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/history-journey`),
          fetch(`${API_BASE_URL}/api/history-timeline`),
          fetch(`${API_BASE_URL}/api/history-mission`)
        ]);

        if (journeyRes.ok) setJourney(await journeyRes.json());
        if (timelineRes.ok) setTimeline(await timelineRes.json());
        if (missionRes.ok) setMission(await missionRes.json());
      } catch (error) {
        console.error("Error fetching history data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-highlight and shift effect for timeline cards
  useEffect(() => {
    if (timeline.length === 0) return;

    let index = timeline.length - 1; // Start from bottom

    setActiveId(timeline[index]._id);

    const interval = setInterval(() => {
      index--;

      if (index < 0) {
        index = timeline.length - 1; // Reset to bottom
      }

      setActiveId(timeline[index]._id);
    }, 3000);

    return () => clearInterval(interval);
  }, [timeline]);

  // Delayed highlight to match line travel duration
  useEffect(() => {
    const timeout = setTimeout(() => {
      setHighlightedId(activeId);
    }, 800);

    return () => clearTimeout(timeout);
  }, [activeId]);

  const getStatusType = (tag: string) => {
    const t = tag?.toLowerCase() || '';
    if (t === 'founded' || t === 'established') return 'established';
    if (t === 'closed') return 'closed';
    return 'active';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--primary)] font-semibold">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-gray-50/20 pt-25 pb-10  border-b border-gray-100">
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
              <a href="#home" className="hover:text-[var(--primary)] transition-colors">
                Home
              </a>
              <ChevronRight className="h-4 w-4" />
              <span className="text-[var(--primary)] font-medium">History</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-[var(--primary)]">History</span>
            </h1>

            <p className="text-xl text-[var(--secondary)] leading-relaxed max-w-2xl mx-auto">
              A legacy built on trust, growth and professional excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History + Timeline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto">
            {/* Left Side: History Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-32"
            >
              <div className="mb-8">
                <span className="px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm font-semibold inline-block mb-4">
                  Since {journey?.sinceYear || '1979'}
                </span>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {journey?.title || 'Our Journey Since 1979'}
                </h2>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--primary)] to-blue-400 rounded-full" />
                  <div className="pl-6 space-y-4">
                    {journey?.description ? (
                      journey.description.split('\n').map((para, index) => (
                        para.trim() && (
                          <p key={index} className="text-lg text-[var(--secondary)] leading-relaxed">
                            {para}
                          </p>
                        )
                      ))
                    ) : (
                      <>
                        <p className="text-lg text-[var(--secondary)] leading-relaxed">
                          The Firm was started in the year 1979 at Hyderabad (AP, India) by CA. R. Raju & CA. K. Prasad.
                        </p>
                        <p className="text-lg text-[var(--secondary)] leading-relaxed">
                          At present the firm is having its offices at Mumbai, Thane, Bangalore, Chennai, Hyderabad, Vijayawada and Tirupati.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <p className="text-4xl font-bold text-[var(--primary)] mb-2">{journey?.yearsOfService || '46+'}</p>
                  <p className="text-sm text-[var(--secondary)] font-medium">Years of Service</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <p className="text-4xl font-bold text-[var(--primary)] mb-2">{journey?.activeLocations || '7'}</p>
                  <p className="text-sm text-[var(--secondary)] font-medium">Active Locations</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side: Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Branch <span className="text-[var(--primary)]">Timeline</span>
                </h3>
                <p className="text-[var(--secondary)]">Our expansion journey across India</p>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Background Path (Static Grey Line) */}
                <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-100 rounded-full" />

                {/* Animated Progress Line (Traveling Blue Line - Bottom to Top) */}
                {(() => {
                  const activeIndex = timeline.findIndex(item => item._id === activeId);
                  const progress =
                    timeline.length > 1
                      ? ((timeline.length - 1 - activeIndex) / (timeline.length - 1)) * 100
                      : 100;

                  return (
                    <motion.div
                      className="absolute left-8 bottom-4 w-0.5 bg-gradient-to-t from-[var(--primary)] via-blue-400 to-[var(--primary)] z-10 origin-bottom rounded-full"
                      initial={{ height: 0 }}
                      animate={{ height: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      {/* Glowing tip of the traveling line */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--primary)] rounded-full shadow-[0_0_15px_rgba(2,38,131,0.8)]" />
                    </motion.div>
                  );
                })()}

                {/* Timeline Items */}
                <div className="space-y-6">
                  {timeline.length > 0 ? (
                    timeline.map((item, index) => {
                      const status = getStatusType(item.tag);
                      return (
                        <motion.div
                          key={item._id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            layout: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.5 },
                            x: { duration: 0.5 }
                          }}
                          className="relative pl-20 group"
                        >
                          {/* Timeline Dot */}
                          <div
                            className={`absolute left-0 top-4 z-20 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${item._id === highlightedId
                              ? 'bg-gradient-to-br from-[var(--primary)] to-blue-600 shadow-2xl shadow-[var(--primary)]/50 scale-125 ring-4 ring-white'
                              : status === 'established'
                                ? 'bg-gradient-to-br from-[var(--primary)] to-blue-500 shadow-lg shadow-[var(--primary)]/30 scale-110'
                                : status === 'active'
                                  ? 'bg-gradient-to-br from-[var(--primary)] to-blue-400 shadow-lg shadow-[var(--primary)]/20'
                                  : 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg shadow-gray-400/20'
                              } group-hover:scale-125 group-hover:shadow-xl`}
                          >
                            {status === 'established' ? (
                              <Calendar className="h-7 w-7 text-white" />
                            ) : (
                              <MapPin className="h-7 w-7 text-white" />
                            )}
                          </div>

                          {/* Content Card */}
                          <div
                            className={`rounded-2xl p-6 shadow-lg border transition-all duration-500 relative ${item._id === highlightedId
                              ? 'bg-gradient-to-br from-[var(--primary)] to-blue-900 border-[var(--primary)] shadow-2xl shadow-[var(--primary)]/30 -translate-y-2 scale-[1.02] text-white'
                              : 'bg-blue-50/40 border-blue-100/50 hover:bg-white hover:border-[var(--primary)]/20 hover:shadow-xl hover:-translate-y-1'
                              }`}
                          >
                            {/* Active Indicator Glow */}
                            {item._id === highlightedId && (
                              <div className="absolute inset-0 bg-blue-400/20 rounded-2xl -z-10 animate-pulse blur-xl" />
                            )}
                            <div className="flex items-start justify-between mb-3">
                              <h4 className={`text-xl font-bold transition-colors ${item._id === highlightedId ? 'text-white' : 'text-gray-900 group-hover:text-[var(--primary)]'}`}>
                                {item.title}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${item._id === highlightedId
                                  ? 'bg-white/20 text-white border border-white/30'
                                  : status === 'established'
                                    ? 'bg-[var(--primary)] text-white'
                                    : status === 'active'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                              >
                                {item.tag || (status === 'established' ? 'Founded' : status === 'active' ? 'Active' : 'Closed')}
                              </span>
                            </div>
                            <p className={`text-sm mb-2 transition-colors ${item._id === highlightedId ? 'text-blue-100' : 'text-[var(--secondary)]'}`}>
                              {item.subtitle}
                            </p>
                            <div className={`flex items-center gap-2 font-semibold transition-colors ${item._id === highlightedId ? 'text-white' : 'text-[var(--primary)]'}`}>
                              <Calendar className="h-4 w-4" />
                              <span
                                className={`text-sm px-3 py-1 rounded-full transition-all duration-300 ${item._id === highlightedId
                                  ? "bg-white text-[var(--primary)]"
                                  : "bg-[var(--primary)]/10 text-[var(--primary)]"
                                  }`}
                              >
                                {item.year}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="pl-20 py-10 text-[var(--secondary)]">No timeline events found.</div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      {mission?.enabled !== false && (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              <div className="relative bg-gradient-to-br from-[var(--primary)] to-blue-600 rounded-3xl p-12 lg:p-16 shadow-2xl shadow-[var(--primary)]/20 overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative z-10">
                  {/* Quote Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="mb-6"
                  >
                    <Quote className="h-16 w-16 text-white/30" />
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                    {mission?.title || 'Our Mission'}
                  </h2>

                  {/* Mission Content */}
                  <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-light">
                    {mission?.content || 'Our Mission is to provide value added and proactive advice to the clients in various sectors with professional ethics and good client relationship.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Want to work with a <span className="text-[var(--primary)]">trusted CA firm?</span>
            </h2>
            <p className="text-lg text-[var(--secondary)] mb-8">
              Experience the legacy of {journey?.yearsOfService || '46+'} years of professional excellence
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--primary)] text-white rounded-full hover:bg-[#011952] transition-all shadow-lg shadow-[var(--primary)]/30 hover:shadow-xl font-semibold"
              >
                Contact Us
                <ArrowRight className="h-5 w-5" />
              </motion.a>

              <motion.a
                href="#services"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[var(--primary)] text-[var(--primary)] rounded-full hover:bg-[var(--primary)] hover:text-white transition-all shadow-lg font-semibold"
              >
                Explore Services
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}

