import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface StatItem {
  _id: string;
  icon: string;
}

interface AboutResponse {
  _id: string;
  enabled: boolean;
  title: string;
  description: string;
  stats: StatItem[];
}

export function ModernStatsSection() {
  const [statsData, setStatsData] = useState<AboutResponse | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/about`);
        const data: AboutResponse = await res.json();
        setStatsData(data);
      } catch (error) {
        console.error("Failed to fetch stats section", error);
      }
    };
    fetchStats();
  }, []);

  const validStats = statsData?.stats.filter((s) => s.icon?.startsWith("/uploads")) ?? [];

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSlide(index);
    setTimeout(() => setIsAnimating(false), 900);
  }, [isAnimating]);

  // Auto-advance every 4.5s
  useEffect(() => {
    if (validStats.length < 2) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % validStats.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [validStats.length]);

  if (!statsData || !statsData.enabled || validStats.length === 0) return null;

  const current = validStats[activeSlide];

  return (
    <section className="py-16 bg-gradient-to-br from-[#F0F4FF] via-[#FFFFFF] to-[#E8F0FE] relative overflow-hidden">

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.07, 0.15, 0.07] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 bg-[var(--primary)] rounded-full blur-[160px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 bg-[var(--secondary)] rounded-full blur-[160px]"
        />
      </div>

      <div className="relative z-10">

        {/* Header */}
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="inline-block px-6 py-2 rounded-full bg-white/60 backdrop-blur-md text-[var(--secondary)] text-sm font-bold tracking-[0.25em] uppercase mb-6 border border-white/70 shadow-md"
            >
              About Us
            </motion.span>

            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              {statsData.title ? (
                <>
                  <span className="text-[#111111]">{statsData.title.split(' ').slice(0, -1).join(' ')}</span>
                  <br />
                  <span className="bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent">
                    {statsData.title.split(' ').slice(-1)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#111111]">About</span>
                  <br />
                  <span className="bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent">Us</span>
                </>
              )}
            </h2>

            <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
              {statsData.description}
            </p>
          </motion.div>
        </div>

        {/* Full-Width Image Viewer with Blur-Dissolve Transition */}
        <div className="w-full px-6 lg:px-16 xl:px-24">

          {/* Image Stage */}
          <div
            className="relative overflow-hidden"
            style={{ height: "clamp(220px, 45vh, 480px)" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current._id}
                className="absolute inset-0 flex items-center justify-center"
                initial={{
                  opacity: 0,
                  scale: 1.06,
                  filter: "blur(18px)",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  filter: "blur(14px)",
                }}
                transition={{
                  duration: 0.85,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <motion.img
                  src={`${API_BASE_URL}${current.icon}`}
                  alt={`Slide ${activeSlide + 1}`}
                  className="block max-w-[90%] max-h-[90%] w-auto h-auto object-contain select-none"
                  style={{
                    filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.13))",
                  }}
                  // Subtle Ken Burns drift on the active image
                  animate={{ scale: [1, 1.03] }}
                  transition={{ duration: 4.5, ease: "linear" }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Ambient glow that shifts with each image */}
            <motion.div
              key={`glow-${activeSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)]/8 via-transparent to-[var(--primary)]/8 blur-[80px] pointer-events-none -z-10"
            />
          </div>

          {/* Navigation: dots + counter */}
          <div className="flex items-center justify-center gap-6 mt-10">

            {/* Prev */}
            <button
              onClick={() => goToSlide((activeSlide - 1 + validStats.length) % validStats.length)}
              disabled={isAnimating}
              className="w-9 h-9 rounded-full border border-[var(--secondary)]/20 flex items-center justify-center text-[var(--secondary)] hover:border-[var(--secondary)] hover:bg-[var(--secondary)]/5 transition-all duration-200 disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Animated pill dots */}
            <div className="flex items-center gap-2">
              {validStats.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <motion.div
                    animate={{
                      width: activeSlide === index ? 32 : 8,
                      opacity: activeSlide === index ? 1 : 0.3,
                      background: activeSlide === index
                        ? "linear-gradient(to right, var(--secondary), var(--primary))"
                        : "var(--secondary)",
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="h-[6px] rounded-full"
                  />
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => goToSlide((activeSlide + 1) % validStats.length)}
              disabled={isAnimating}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] flex items-center justify-center text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}
