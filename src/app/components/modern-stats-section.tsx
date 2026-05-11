import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface StatItem {
  _id: string;
  image: string;
  text?: string;
}

interface AboutResponse {
  _id: string;
  enabled: boolean;
  stats: StatItem[];
}

export function ModernStatsSection() {
  const [statsData, setStatsData] = useState<AboutResponse | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(0);

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
  const total = validStats.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setActiveSlide((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setActiveSlide((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (index: number) => {
    setDirection(index > activeSlide ? 1 : -1);
    setActiveSlide(index);
  };

  // Auto-advance logic
  useEffect(() => {
    if (total < 2) return;
    const timer = setInterval(nextSlide, 6000); // 6 seconds for each slide
    return () => clearInterval(timer);
  }, [total, nextSlide]);

  if (!statsData || statsData.enabled === false || total === 0) return null;

  const variants = {
    enter: {
      opacity: 0,
    },
    center: {
      zIndex: 1,
      opacity: 1,
      transition: {
        opacity: { duration: 1, ease: "easeInOut" }
      }
    },
    exit: {
      zIndex: 0,
      opacity: 0,
      transition: {
        opacity: { duration: 1, ease: "easeInOut" }
      }
    }
  };

  return (
    <section className="relative w-full h-auto overflow-hidden group/section">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSlide}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="relative w-full h-auto"
        >
          {/* Background Image */}
          <div className="relative w-full h-full">
            <img
              src={validStats[activeSlide].image}
              alt=""
              className="w-full h-auto block"
            />


            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center ml-[20%] text-left px-6">
              <motion.h2
                key={activeSlide}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-white text-3xl md:text-5xl lg:text-5xl font-bold max-w-5xl leading-tight drop-shadow-2xl"
              >
                {validStats[activeSlide].text}
              </motion.h2>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Using the style from the user's image (thin white border) */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center z-20 pointer-events-none opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
        <button
          onClick={prevSlide}
          className="pointer-events-auto w-10 h-10 md:w-16 md:h-16 border border-white/100 flex items-center justify-center text-white backdrop-blur-sm hover:bg-white hover:text-black hover:border-white transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto w-10 h-10 md:w-16 md:h-16 border border-white/40 flex items-center justify-center text-white backdrop-blur-sm hover:bg-white hover:text-black hover:border-white transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      {/* Pagination Dots - Center Bottom */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4 items-center opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
        {validStats.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="p-2 transition-transform hover:scale-125"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div
              className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-500 ${activeSlide === i
                ? "bg-[#00AEEF] border-[#ffffff] scale-125"
                : "bg-transparent"
                }`}
            />
          </button>
        ))}
      </div>

    </section>
  );
}