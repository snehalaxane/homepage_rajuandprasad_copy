import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Layout constants for the "Depth" effect
const CARD_W = 1024;
const CARD_H = 375;
const GAP = 180; // Increased gap for better stacked visibility

interface StatItem {
  _id: string;
  image: string;
  text?: string; // optional caption for each stat image
}

interface AboutResponse {
  _id: string;
  enabled: boolean;
  title: string;
  description: string;
  stats: StatItem[];
}

// 1. CHANGED TO NAMED EXPORT to match your HomePage import
export function ModernStatsSection() {
  const [statsData, setStatsData] = useState<AboutResponse | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/about`);
        if (!res.ok) throw new Error("Fetch failed");
        const data: AboutResponse = await res.json();
        const enrichedStats = (data.stats || []).map((s: any) => {
          const imgPath = s.image || s.icon || "";
          return {
            ...s,
            text: s.text || "",
            image: imgPath ? (imgPath.startsWith("http") ? imgPath : `${API_BASE_URL}${imgPath}`) : ""
          };
        });
        setStatsData({ ...data, stats: enrichedStats });
      } catch (error) {
        console.error("Failed to fetch stats section", error);
      }
    };
    fetchStats();
  }, []);

  const validStats = Array.isArray(statsData?.stats) ? statsData.stats : [];
  const total = Math.max(validStats.length, 1);

  const goToSlide = useCallback((index: number) => {
    setActiveSlide(index);
    setProgress(0);
  }, []);

  // Auto-advance logic
  useEffect(() => {
    if (total < 2) return;
    const INTERVAL = 5000;
    const TICK = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += TICK;
      setProgress(Math.min((elapsed / INTERVAL) * 100, 100));
      if (elapsed >= INTERVAL) {
        elapsed = 0;
        setActiveSlide((prev) => (prev + 1) % total);
        setProgress(0);
      }
    }, TICK);

    return () => clearInterval(timer);
  }, [total, activeSlide]);

  if (!statsData) return null;

  return (
    <section className="py-10 bg-[#ffff] text-white overflow-hidden relative min-h-[800px]">

      {/* Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.2, 0.15] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6">

        {/* Header Section */}
        <div className="text-center mb-5">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-1 py-0  rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold tracking-widest uppercase mb-4"
          >
            Our Expertise
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-[#111111]">
            {statsData.title.split(' ').map((word, i) => {
              const isNumberWord = /\d/.test(word);
              return (
                <span key={i} className={isNumberWord ? "bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent" : "text-[#111111]"}>
                  {word}{' '}
                </span>
              );
            })}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            {statsData.description}
          </p>
        </div>

        {/* The "Depth" Carousel */}
        <div className="relative h-[450px] flex items-center justify-center">
          <div className="relative w-full max-w-6xl flex items-center justify-center">

            <AnimatePresence initial={false}>
              {validStats.map((stat, i) => {
                let offset = i - activeSlide;

                // Infinite loop wrapping logic
                if (offset > Math.floor(total / 2)) offset -= total;
                if (offset < -Math.floor(total / 2)) offset += total;

                const isActive = offset === 0;
                const isVisible = Math.abs(offset) <= 1;

                return (
                  <motion.div
                    key={stat._id}
                    initial={false}
                    animate={{
                      x: offset * GAP,
                      scale: isActive ? 1 : 0.8,
                      zIndex: isActive ? 40 : 30 - Math.abs(offset),
                      opacity: isVisible ? (isActive ? 1 : 0.4) : 0,
                      filter: isActive ? "blur(0px)" : "blur(4px)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 26
                    }}
                    className="absolute cursor-pointer select-none"
                    style={{ width: CARD_W, height: CARD_H }}
                    onClick={() => setActiveSlide(i)}
                  >
                    <div className="relative w-full h-full group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                      {stat.image ? (
                        <img
                          src={stat.image}
                          alt="Stats Graphic"
                          className="w-full h-full object-cover rounded-[2rem] border border-white/10 shadow-2xl relative z-10"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-[#16181D] to-[#2B2F36] border border-white/10 shadow-2xl relative z-10 flex items-center justify-center">
                          <span className="text-gray-500 italic">No Graphics</span>
                        </div>
                      )}
                      {/* Premium Letter-by-Letter Animated Caption */}
                      <motion.div
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{
                          duration: 1.2,
                          ease: "easeInOut",
                          delay: isActive ? 0.7 : 0
                        }}
                        className="absolute inset-0 z-50 flex items-center justify-center px-6 pointer-events-none"
                      >
                        <p className="text-white text-xxl md:text-5xl font-bold tracking-tight text-center uppercase drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] whitespace-nowrap">
                          {stat.text}
                        </p>
                      </motion.div>

                      {!isActive && (
                        <div className="absolute inset-0 bg-black/40 z-20 rounded-[2rem] transition-opacity" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Custom Pagination */}
        <div className="flex justify-center items-center gap-4 mt-16">
          {validStats.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group flex flex-col items-center"
            >
              <div className="h-1 w-16 rounded-full bg-white/10 overflow-hidden relative">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: activeSlide === index ? `${progress}%` : (index < activeSlide ? "100%" : "0%")
                  }}
                />
              </div>
              <span className={`text-[10px] mt-2 font-mono transition-colors ${activeSlide === index ? 'text-white' : 'text-gray-600'}`}>
                0{index + 1}
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}