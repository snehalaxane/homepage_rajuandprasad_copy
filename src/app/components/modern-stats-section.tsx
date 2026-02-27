import { motion } from "motion/react";
import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const STRIPS = 5;

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

// Strip-by-strip reveal — each horizontal slice flies in from alternating sides
function StripReveal({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: STRIPS }).map((_, i) => {
        const topPct = i === 0 ? 0 : (i * 100) / STRIPS - 0.8;
        const bottomPct = i === STRIPS - 1 ? 0 : 100 - ((i + 1) * 100) / STRIPS - 0.8;
        const fromLeft = i % 2 === 0;

        return (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              clipPath: `inset(${topPct}% 0 ${bottomPct}% 0)`,
            }}
            initial={{ x: fromLeft ? "-105%" : "105%", opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              delay: i * 0.055,
              duration: 0.42,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Full image repeated per strip — clip-path reveals only its slice */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={src}
                alt={alt}
                draggable={false}
                className="max-w-[90%] max-h-[90%] w-auto h-auto object-contain select-none"
                style={{ filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.12))" }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function ModernStatsSection() {
  const [statsData, setStatsData] = useState<AboutResponse | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [revealKey, setRevealKey] = useState(0); // remount StripReveal on each change
  const [progress, setProgress] = useState(0);

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
    setActiveSlide((prev) => {
      setPrevSlide(prev);
      return index;
    });
    setRevealKey((k) => k + 1);
    setProgress(0);
    // Clear prevSlide after animation
    setTimeout(() => setPrevSlide(null), 700);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (validStats.length < 2) return;
    const INTERVAL = 4200;
    const TICK = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += TICK;
      setProgress(Math.min((elapsed / INTERVAL) * 100, 100));
      if (elapsed >= INTERVAL) {
        elapsed = 0;
        setActiveSlide((prev) => {
          const next = (prev + 1) % validStats.length;
          setPrevSlide(prev);
          setRevealKey((k) => k + 1);
          setTimeout(() => setPrevSlide(null), 700);
          return next;
        });
        setProgress(0);
      }
    }, TICK);

    return () => clearInterval(timer);
  }, [validStats.length]);

  if (!statsData || !statsData.enabled || validStats.length === 0) return null;

  const current = validStats[activeSlide];
  const previous = prevSlide !== null ? validStats[prevSlide] : null;

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

        {/* Image Stage */}
        <div className="w-full px-6 lg:px-16 xl:px-24">
          <div
            className="relative overflow-hidden rounded-xl"
            style={{ height: "clamp(220px, 45vh, 480px)" }}
          >
            {/* Exiting image fades out behind the strips */}
            {previous && (
              <motion.div
                key={`exit-${prevSlide}`}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <img
                  src={`${API_BASE_URL}${previous.icon}`}
                  alt="Previous"
                  draggable={false}
                  className="max-w-[90%] max-h-[90%] w-auto h-auto object-contain select-none"
                  style={{ filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.10))" }}
                />
              </motion.div>
            )}

            {/* Incoming image with strip reveal */}
            <StripReveal
              key={revealKey}
              src={`${API_BASE_URL}${current.icon}`}
              alt={`Slide ${activeSlide + 1}`}
            />

            {/* Slide counter */}
            <div className="absolute bottom-3 right-4 text-[11px] font-semibold tracking-widest text-[var(--secondary)]/40 select-none z-10">
              {String(activeSlide + 1).padStart(2, "0")} / {String(validStats.length).padStart(2, "0")}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">

            {/* Prev */}
            <button
              onClick={() => goToSlide((activeSlide - 1 + validStats.length) % validStats.length)}
              className="w-9 h-9 rounded-full border border-[var(--secondary)]/20 flex items-center justify-center text-[var(--secondary)] hover:border-[var(--secondary)] hover:bg-[var(--secondary)]/5 transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-3">
              {validStats.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className="relative flex items-center justify-center"
                >
                  <motion.div
                    animate={{ width: activeSlide === index ? 36 : 8 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="h-[5px] rounded-full bg-[var(--secondary)]/15 overflow-hidden relative"
                  >
                    {/* Animated fill bar inside the active dot */}
                    {activeSlide === index && (
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)]"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </motion.div>
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => goToSlide((activeSlide + 1) % validStats.length)}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] flex items-center justify-center text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
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
