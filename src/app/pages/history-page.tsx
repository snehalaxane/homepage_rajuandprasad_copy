import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, MapPin, Calendar, Quote, ArrowRight } from 'lucide-react';
import { ScrollToTop } from '../components/scroll-to-top';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper to resolve image URLs reliably
const resolveImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

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
  status?: string;
}

interface HistoryMission {
  title: string;
  content: string;
  enabled: boolean;
}

interface HistoryIntro {
  title: string;
  description: string;
  backgroundImage: string;
  enabled: boolean;
}

export function HistoryPage() {
  const [journey, setJourney] = useState<HistoryJourney | null>(null);
  const [timeline, setTimeline] = useState<HistoryTimeline[]>([]);
  const [mission, setMission] = useState<HistoryMission | null>(null);
  const [introData, setIntroData] = useState<HistoryIntro | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [journeyRes, timelineRes, missionRes, introRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/history-journey`),
          fetch(`${API_BASE_URL}/api/history-timeline`),
          fetch(`${API_BASE_URL}/api/history-mission`),
          fetch(`${API_BASE_URL}/api/history-intro`)
        ]);

        if (journeyRes.ok) setJourney(await journeyRes.json());
        if (timelineRes.ok) setTimeline(await timelineRes.json());
        if (missionRes.ok) setMission(await missionRes.json());
        if (introRes.ok) setIntroData(await introRes.json());
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--primary)] font-semibold">Loading history...</p>
        </div>
      </div>
    );
  }

  if (introData && introData.enabled === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Unavailable</h1>
          <p className="text-gray-600">This page is currently being updated. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section
        className="relative overflow-hidden w-full aspect-[1920/375] bg-cover bg-center bg-no-repeat flex items-center" style={{
          backgroundImage: introData?.backgroundImage ? `url(${resolveImageUrl(introData.backgroundImage)})` : 'none',
          backgroundColor: !introData?.backgroundImage ? 'transparent' : 'inherit'
        }}
      >
        {!introData?.backgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-white via-[rgba(var(--primary-rgb),0.05)] to-gray-50/20" />
        )}

        {/* Overlay if there is a background image to ensure text readability */}
        {introData?.backgroundImage && (
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
            {/* <div className={`flex items-center gap-2 text-m mb-6 ${introData?.backgroundImage ? 'text-gray-300' : 'text-[var(--secondary)]'}`}>
              <a href="#home" className={`transition-colors hover:text-white`}>Home</a>
              <ChevronRight className="h-4 w-4" />
              <span className={introData?.backgroundImage ? 'text-white font-semibold' : 'text-[var(--primary)] font-semibold'}>History</span>
            </div> */}
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

      <div className="w-full bg-background border-t-4 border-[var(--primary)]">
        <div className="container mx-auto px-6 py-4">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-m text-white">
            <a href="/" className="hover:text-white">Home</a>
            {/* <span className="text-black text-xl">›</span> */}
            <span className="text-black text-2xl">›</span>
            <span className="text-white font-semibold">History</span>
          </div>

        </div>

        {/* White bottom line */}
        <div className="w-full h-[2px] bg-white"></div>
      </div>

      {/* History + Timeline Section */}
      <section className="py-20 bg-background">
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
                {/* <span className="px-4 py-2 bg-[var(--primary)] text-white rounded-full text-sm font-semibold inline-block mb-4">
                  Since {journey?.sinceYear || '1979'}
                </span> */}
                <h2 className="text-4xl lg:text-5xl font-bold text-[var(--primary)] mb-6 ml-5">
                  {journey?.title}
                </h2>
              </div>

              <div className="bg-background rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--primary)] to-[var(--primary)]/60 rounded-full" />
                  <div className="pl-6 space-y-4">
                    {journey?.description ? (
                      journey.description.split('\n').map((para, index) => (
                        para.trim() && (
                          <p key={index} className="text-xl text-white leading-relaxed">
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

              {mission?.enabled !== false && (
                <div className="mt-20">

                  {/* Title OUTSIDE (same as journey) */}
                  <div className="mb-6">
                    <h2 className="text-4xl lg:text-5xl font-bold text-[var(--primary)] mb-6 ml-5">
                      {mission?.title}
                    </h2>
                  </div>

                  {/* Card */}
                  <div className="bg-background rounded-3xl p-8 shadow-lg border border-gray-100">
                    <div className="relative">

                      {/* Left vertical line */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--primary)] to-[var(--primary)]/60 rounded-full" />

                      <div className="pl-6 space-y-4">
                        {mission?.content?.split('\n').map((para, i) => (
                          para.trim() && (
                            <p key={i} className="text-xl text-white leading-relaxed ">
                              {para}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </motion.div>

            {/* Right Side: Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-2 ml-20">
                  Branch <span className="text-[var(--primary)]">Timeline</span>
                </h3>
                <p className="text-white ml-20">Our expansion journey across India</p>
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
                          onMouseEnter={() => setHoverId(item._id)}
                          onMouseLeave={() => setHoverId(null)}
                        >
                          {/* Timeline Dot */}
                          <div
                            className={`absolute left-0 top-4 z-20 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${item._id === highlightedId
                              ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] shadow-2xl shadow-[var(--primary)]/50 scale-125 ring-4 ring-white'
                              : item._id === hoverId
                                ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] shadow-lg shadow-[var(--primary)]/30 scale-110'
                                : item.status === 'past'
                                  ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 shadow-lg shadow-[var(--primary)]/20'
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
                              ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] border-[var(--primary)] shadow-2xl shadow-[var(--primary)]/30 -translate-y-2 scale-[1.02] text-white'
                              : 'bg-background border-gray-100 hover:bg-white hover:border-[var(--primary)]/20 hover:shadow-xl hover:-translate-y-1'
                              }`}
                          >
                            {/* Active Indicator Glow */}
                            {item._id === highlightedId && (
                              <div className="absolute inset-0 bg-[var(--primary)]/5 rounded-2xl -z-10 animate-pulse blur-xl" />
                            )}
                            <div className="flex items-start justify-between mb-3">
                              <h4 className={`text-xl font-bold transition-colors ${item._id === highlightedId ? 'text-white' : 'text-gray-900 group-hover:text-[var(--primary)]'}`}>
                                {item.title}
                              </h4>
                              {/* <span
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
                              </span> */}
                            </div>
                            <p className={`text-sm mb-2 transition-colors ${item._id === highlightedId ? 'text-blue-100' : 'text-black'}`}>
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
      <ScrollToTop />
    </div>
  );
}

