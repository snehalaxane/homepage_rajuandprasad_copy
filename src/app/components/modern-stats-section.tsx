// import { motion } from "motion/react";
// import { useState, useEffect, useCallback } from "react";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Layout constants (px)
// const CONTAINER_W = 1000;  // Wider to allow side cards to breath
// const CONTAINER_H = 450;
// const CARD_W = 600;        // Focus card width
// const CARD_H = 350;
// const GAP = 120;         // how many px of prev/next card shows on each side

// // Left-edge X positions for each role
// // const ACTIVE_X = (CONTAINER_W - CARD_W) / 2; // = 80 — centered
// // const PREV_X = PEEK - CARD_W;                  // = -640 — only right PEEK px visible
// // const NEXT_X = CONTAINER_W - PEEK;             // = 800 — only left PEEK px visible

// interface StatItem {
//   _id: string;
//   icon: string;
// }

// interface AboutResponse {
//   _id: string;
//   enabled: boolean;
//   title: string;
//   description: string;
//   stats: StatItem[];
// }

// export function ModernStatsSection() {
//   const [statsData, setStatsData] = useState<AboutResponse | null>(null);
//   const [activeSlide, setActiveSlide] = useState(0);
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/about`);
//         const data: AboutResponse = await res.json();
//         setStatsData(data);
//       } catch (error) {
//         console.error("Failed to fetch stats section", error);
//       }
//     };
//     fetchStats();
//   }, []);

//   const validStats = statsData?.stats.filter((s) => s.icon?.startsWith("/uploads")) ?? [];
//   const total = validStats.length;

//   const goToSlide = useCallback((index: number) => {
//     setActiveSlide(index);
//     setProgress(0);
//   }, []);

//   const goNext = useCallback(() => goToSlide((activeSlide + 1) % total), [activeSlide, total, goToSlide]);
//   const goPrev = useCallback(() => goToSlide((activeSlide - 1 + total) % total), [activeSlide, total, goToSlide]);

//   // Auto-advance with progress tracking
//   useEffect(() => {
//     if (total < 2) return;
//     const INTERVAL = 4000;
//     const TICK = 50;
//     let elapsed = 0;

//     const timer = setInterval(() => {
//       elapsed += TICK;
//       setProgress(Math.min((elapsed / INTERVAL) * 100, 100));
//       if (elapsed >= INTERVAL) {
//         elapsed = 0;
//         setActiveSlide((prev) => (prev + 1) % total);
//         setProgress(0);
//       }
//     }, TICK);

//     return () => clearInterval(timer);
//   }, [total]);

//   if (!statsData || !statsData.enabled || total === 0) return null;

//   return (
//     <section className="py-16 bg-gradient-to-br from-[#F0F4FF] via-[#FFFFFF] to-[#E8F0FE] relative overflow-hidden">

//       {/* Animated Background Blobs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <motion.div
//           animate={{ scale: [1, 1.25, 1], opacity: [0.07, 0.15, 0.07] }}
//           transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 bg-[var(--primary)] rounded-full blur-[160px]"
//         />
//         <motion.div
//           animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.12, 0.05] }}
//           transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
//           className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 bg-[var(--secondary)] rounded-full blur-[160px]"
//         />
//       </div>

//       <div className="relative z-10">

//         {/* Header */}
//         <div className="container mx-auto px-6">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.9, ease: "easeOut" }}
//             className="text-center mb-12"
//           >
//             <motion.span
//               initial={{ opacity: 0, scale: 0.85 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.7 }}
//               className="inline-block px-6 py-2 rounded-full bg-white/60 backdrop-blur-md text-[var(--secondary)] text-sm font-bold tracking-[0.25em] uppercase mb-6 border border-white/70 shadow-md"
//             >
//               About Us
//             </motion.span>

//             <h2 className="text-4xl lg:text-5xl font-bold mb-4">
//               {statsData.title ? (
//                 <>
//                   <span className="text-[#111111]">{statsData.title.split(' ').slice(0, -1).join(' ')}</span>
//                   <br />
//                   <span className="bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent">
//                     {statsData.title.split(' ').slice(-1)}
//                   </span>
//                 </>
//               ) : (
//                 <>
//                   <span className="text-[#111111]">About</span>
//                   <br />
//                   <span className="bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent">Us</span>
//                 </>
//               )}
//             </h2>

//             <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
//               {statsData.description}
//             </p>
//           </motion.div>
//         </div>

//         {/* Visible-Edge Carousel */}
//         <div className="flex justify-center">
//           <div
//             className="relative overflow-hidden"
//             style={{ width: CONTAINER_W, maxWidth: "100%", height: CONTAINER_H }}
//           >
//             {validStats.map((stat, i) => {
//               const diff = (i - activeSlide + total) % total;
//               const isActive = diff === 0;
//               const isNext = diff === 1;
//               const isPrev = diff === total - 1;
//               const isVisible = isActive || isNext || isPrev;

//               // Compute target position
//               let targetX = ACTIVE_X;
//               if (isPrev) targetX = PREV_X;
//               else if (isNext) targetX = NEXT_X;
//               else if (diff > 1 && diff <= Math.floor(total / 2)) targetX = CONTAINER_W + CARD_W; // far right
//               else targetX = -CARD_W * 2; // far left

//               const targetScale = isActive ? 1 : 0.88;
//               const targetOpacity = isActive ? 1 : isVisible ? 0.55 : 0;
//               const targetBlur = isActive ? 0 : 5;
//               const targetZ = isActive ? 10 : 5;

//               return (
//                 <motion.div
//                   key={stat._id}
//                   className="absolute top-1/2"
//                   style={{ width: CARD_W, height: CARD_H }}
//                   animate={{
//                     x: targetX,
//                     y: -CARD_H / 2,
//                     scale: targetScale,
//                     opacity: targetOpacity,
//                     filter: `blur(${targetBlur}px)`,
//                     zIndex: targetZ,
//                   }}
//                   transition={{
//                     x: { type: "spring", stiffness: 300, damping: 30 },
//                     scale: { duration: 0.4, ease: "easeInOut" },
//                     opacity: { duration: 0.35, ease: "easeInOut" },
//                     filter: { duration: 0.4, ease: "easeInOut" },
//                   }}
//                   onClick={() => {
//                     if (isNext) goNext();
//                     else if (isPrev) goPrev();
//                   }}
//                   style={{
//                     width: CARD_W,
//                     height: CARD_H,
//                     cursor: isActive ? "default" : "pointer",
//                   }}
//                 >
//                   {/* Image — no card background, raw image */}
//                   <img
//                     src={`${API_BASE_URL}${stat.icon}`}
//                     alt={`Slide ${i + 1}`}
//                     draggable={false}
//                     className="w-full h-full object-contain select-none rounded-xl"
//                     style={{
//                       filter: isActive
//                         ? "drop-shadow(0 20px 50px rgba(0,0,0,0.13))"
//                         : "none",
//                     }}
//                   />
//                 </motion.div>
//               );
//             })}

//             {/* Left click zone for prev */}
//             <button
//               onClick={goPrev}
//               className="absolute left-0 top-0 h-full z-20 flex items-center pl-2 pr-4 group"
//               style={{ width: PEEK + 24 }}
//               aria-label="Previous"
//             >
//               <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--secondary)]">
//                   <polyline points="15 18 9 12 15 6" />
//                 </svg>
//               </div>
//             </button>

//             {/* Right click zone for next */}
//             <button
//               onClick={goNext}
//               className="absolute right-0 top-0 h-full z-20 flex items-center pr-2 pl-4 group"
//               style={{ width: PEEK + 24 }}
//               aria-label="Next"
//             >
//               <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-auto">
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--secondary)]">
//                   <polyline points="9 18 15 12 9 6" />
//                 </svg>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Navigation Dots */}
//         <div className="flex justify-center items-center gap-3 mt-8">
//           {validStats.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => goToSlide(index)}
//               aria-label={`Go to slide ${index + 1}`}
//             >
//               <motion.div
//                 animate={{ width: activeSlide === index ? 36 : 8 }}
//                 transition={{ duration: 0.35, ease: "easeInOut" }}
//                 className="h-[5px] rounded-full bg-[var(--secondary)]/15 overflow-hidden relative"
//               >
//                 {activeSlide === index && (
//                   <motion.div
//                     className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)]"
//                     style={{ width: `${progress}%` }}
//                   />
//                 )}
//               </motion.div>
//             </button>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// }


import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Layout constants for the "Depth" effect
const CARD_W = 720;
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
    <section className="py-24 bg-[#ffff] text-white overflow-hidden relative min-h-[800px]">

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
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold tracking-widest uppercase mb-4"
          >
            Our Statistics
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
                          className="w-full h-full object-contain rounded-[2rem] border border-white/10 shadow-2xl relative z-10"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-[#16181D] to-[#2B2F36] border border-white/10 shadow-2xl relative z-10 flex items-center justify-center">
                          <span className="text-gray-500 italic">No Graphics</span>
                        </div>
                      )}
                      {/* Premium Letter-by-Letter Animated Caption */}
                      {stat.text && (
                        <motion.div
                          initial="hidden"
                          animate={isActive ? "visible" : "hidden"}
                          variants={{
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: { staggerChildren: 0.04, delayChildren: 0.2 }
                            }
                          }}
                          className="absolute inset-x-0 bottom-16 z-50 flex justify-center px-6 pointer-events-none"
                        >
                          <p className="flex flex-nowrap justify-center gap-x-[0.1em] text-white text-xl md:text-2xl font-bold tracking-tight text-center uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] whitespace-nowrap">
                            {stat.text.split("").map((char, index) => (
                              <motion.span
                                key={index}
                                variants={{
                                  hidden: {
                                    opacity: 0,
                                    x: index % 2 === 0 ? -40 : 40,
                                    y: 20,
                                    rotate: index % 2 === 0 ? -15 : 15
                                  },
                                  visible: {
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    rotate: 0,
                                    transition: { type: "spring", damping: 12, stiffness: 150 }
                                  }
                                }}
                                className="inline-block origin-center"
                              >
                                {char === " " ? "\u00A0" : char}
                              </motion.span>
                            ))}
                          </p>
                        </motion.div>
                      )}

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