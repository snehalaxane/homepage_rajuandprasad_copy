import { motion } from "motion/react";
import { useState, useEffect } from "react";

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

  // Auto-advance every 4s
  useEffect(() => {
    if (!statsData || !statsData.enabled || !statsData.stats?.length) return;
    // Only show stats that have valid uploaded image paths
    const validStats = statsData.stats.filter((s) => s.icon?.startsWith("/uploads"));
    if (!validStats.length) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % validStats.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [statsData]);

  if (!statsData || !statsData.enabled) return null;

  // Only render items that have a valid uploaded image
  const validStats = statsData.stats.filter((s) => s.icon?.startsWith("/uploads"));
  if (!validStats.length) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-[#F0F4FF] via-[#FFFFFF] to-[#E8F0FE] relative overflow-hidden">

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 bg-[var(--primary)] rounded-full blur-[160px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 bg-[var(--secondary)] rounded-full blur-[160px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-[var(--secondary)] rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10">

        {/* Header */}
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="inline-block px-6 py-2 rounded-full bg-white/60 backdrop-blur-md text-[var(--secondary)] text-sm font-bold tracking-[0.25em] uppercase mb-8 border border-white/70 shadow-md"
            >
              About Us
            </motion.span>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
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
                  <span className="bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent">
                    Us
                  </span>
                </>
              )}
            </h2>

            <p className="text-xl lg:text-2xl text-gray-500 max-w-4xl mx-auto leading-relaxed font-medium">
              {statsData.description}
            </p>
          </motion.div>
        </div>

        {/* Cinematic Scroller — Full Width with Side Padding */}
        <div className="w-full px-6 lg:px-16 xl:px-24">

          {/* Clip + height container */}
          <div
            className="relative overflow-hidden"
            style={{ height: "clamp(220px, 45vh, 480px)" }}
          >
            {/* Sliding rail */}
            <div
              className="flex h-full"
              style={{
                width: `${validStats.length * 100}%`,
                transform: `translateX(-${(activeSlide * 100) / validStats.length}%)`,
                transition: "transform 1.1s cubic-bezier(0.19, 1, 0.22, 1)",
              }}
            >
              {validStats.map((stat, index) => (
                <div
                  key={stat._id}
                  className="relative flex items-center justify-center h-full"
                  style={{ width: `${100 / validStats.length}%` }}
                >
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={false}
                    animate={{
                      scale: activeSlide === index ? 1 : 0.82,
                      opacity: activeSlide === index ? 1 : 0.12,
                      filter: activeSlide === index ? "blur(0px)" : "blur(14px)",
                    }}
                    transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
                  >
                    <img
                      src={`${API_BASE_URL}${stat.icon}`}
                      alt={`Slide ${index + 1}`}
                      className="block max-w-[90%] max-h-[90%] w-auto h-auto object-contain select-none"
                      style={{
                        filter: activeSlide === index
                          ? "drop-shadow(0 24px 64px rgba(0,0,0,0.15))"
                          : "none",
                      }}
                    />

                    {/* Ambient glow */}
                    {activeSlide === index && (
                      <motion.div
                        key={`glow-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)]/10 via-transparent to-[var(--primary)]/10 blur-[100px] -z-10"
                      />
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center items-center gap-3 mt-14">
            {validStats.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="relative flex items-center justify-center h-5"
              >
                <motion.div
                  animate={{
                    width: activeSlide === index ? 48 : 8,
                    opacity: activeSlide === index ? 1 : 0.25,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={`h-[5px] rounded-full ${activeSlide === index
                    ? "bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)]"
                    : "bg-[var(--secondary)]"
                    }`}
                />
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
