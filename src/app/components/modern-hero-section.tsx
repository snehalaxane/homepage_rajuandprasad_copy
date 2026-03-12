import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



export function ModernHeroSection() {
  const [hero, setHero] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [displayNumber, setDisplayNumber] = useState(0);
  const [generalSettings, setGeneralSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/settings/general`);
        const data = await res.json();
        setGeneralSettings(data);
      } catch (err) {
        console.error("Failed to fetch settings");
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!hero?.highlightNumber) return; // Wait until hero data is loaded

    const target = parseInt(hero.highlightNumber) || 0;
    let count = 0;
    let timer: any;

    // Reset display
    setDisplayNumber(0);

    // Delay start to prevent skipping during page mount/heavy loading
    const startDelay = setTimeout(() => {
      timer = setInterval(() => {
        if (count < target) {
          count++;
          setDisplayNumber(count);
        } else {
          clearInterval(timer);
        }
      }, 150); // Balanced for speed and visibility
    }, 500);

    return () => {
      clearTimeout(startDelay);
      if (timer) clearInterval(timer);
    };
  }, [hero?.highlightNumber]); // Re-run when highlightNumber from backend changes

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/hero`);
        const data = await res.json();
        setHero(data);
      } catch (err) {
        console.error("Failed to fetch hero data");
      }
    };

    fetchHero();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/map-locations`);
        const data = await res.json();
        setLocations(data);
      } catch (error) {
        console.error("Failed to fetch locations", error);
      }
    };

    fetchLocations();
  }, []);

  // Hide the section if disabled from admin panel
  if (hero && hero.enabled === false) return null;

  return (
    <section className="relative flex items-center overflow-hidden h-[calc(100vh-80px)] min-h-[500px]">
      {/* Top Left Logo - Restored and adjusted */}
      <div className="absolute top-6 left-6 z-50">
        <motion.a
          href="#home"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center"
        >
          <img
            src={generalSettings?.logoUrl ? `${API_BASE_URL}${generalSettings.logoUrl}` : "figma:asset/c4cd0f731adca963ac419fbf6c2297a5d87d3404.png"}
            alt={generalSettings?.siteTitle || "Raju & Prasad"}
            className="h-12 w-auto brightness-0 invert object-contain hover:scale-105 transition-transform duration-300"
          />
        </motion.a>
      </div>

      {/* Background decoration - Fixed color #7A7876 */}
      <div className="absolute inset-0" style={{ backgroundColor: '#7A7876' }}>
        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Abstract Wave Shapes - Lighter grey tones for depth */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl"
          />

          {/* Additional decorative circles for visual interest */}
          <motion.div
            animate={{
              y: [0, 30, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-white/10 blur-2xl"
          />
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-white/10 blur-2xl"
          />
        </div>


      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-5 py-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="-ml-4"
          >
            {/* Years Badge */}
            {/* Years Badge - Commented out as requested */}
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-6 mb-2"
            >
              <div className="relative">
                <div className="relative px-0 py-1 min-w-[240px] h-[240px] flex justify-center items-center">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={displayNumber}
                      initial={{ opacity: 0, scale: 0.5, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -30 }}
                      transition={{ duration: 0.1, ease: "easeInOut" }}
                      className="text-[200px] font-extrabold bg-gradient-to-b from-[#F5C542] via-[#FFD700] to-[#B8860B] bg-clip-text text-transparent inline-block drop-shadow-[0_20px_50px_rgba(245,197,66,0.5)] select-none relative z-20 leading-none"
                    >
                      {displayNumber}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                {hero?.highlightText ? (
                  hero.highlightText
                    .split(" ")
                    .reduce((acc: string[], word: string, i: number) => {
                      if (i % 2 === 0) {
                        acc.push(word + " " + (hero.highlightText.split(" ")[i + 1] || ""));
                      }
                      return acc;
                    }, [])
                    .map((line: string, i: number) => (
                      <p
                        key={i}
                        className="text-5xl font-bold text-[#F5C542] drop-shadow-xl leading-[0.9]"
                      >
                        {line}
                      </p>
                    ))
                ) : null}
              </div>
            </motion.div> */}


            {/* Main Heading */}
            {/* Main Heading - Commented out as requested */}
            {/* <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl lg:text-6xl xl:text-2xl font-bold mb-6 leading-tight"
            >
              <span className="text-[#F5C542] text-5xl ">{(hero?.title)}</span>
              <br />
            </motion.h1> */}

            {/* Hero Image Replacement */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-wrap gap-6 mb-3"

            >
              {[
                { url: hero?.imageUrl, alt: "Primary" }
              ].map((img, idx) => img.url && (
                <div key={idx} className="relative group max-w-[350px]">

                  <img
                    src={img.url.startsWith('http') ? img.url : `${API_BASE_URL}/${img.url}`}
                    alt={img.alt}
                    className="w-full h-auto object-contain transform transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </motion.div>


            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-white/90 leading-relaxed mb-6 max-w-xl drop-shadow-lg"

            >
              <motion.span
                animate={{
                  opacity: [1, 0.6, 1],
                  filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block"
              >
                {hero?.description}
              </motion.span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                onClick={() => window.location.href = hero?.ctas?.[0]?.link}
                className="px-8 py-6 text-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl shadow-2xl hover:shadow-[var(--primary)]/30 transition-all group"
              >
                {hero?.ctas?.[0]?.text}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => window.location.href = hero?.ctas?.[1]?.link}
                variant="outline"
                className="px-8 py-6 text-lg bg-white border-2 border-white text-[var(--secondary)] hover:bg-white/90 hover:text-[var(--primary)] rounded-xl transition-all shadow-xl"
              >
                {hero?.ctas?.[1]?.text}
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-2 pt-2 border-t border-white/30"
            >
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-3xl font-bold text-white drop-shadow-lg">{(hero?.stat1 || "").split(" ")[0]}</p>
                  <p className="text-sm text-white/90 font-semibold">{(hero?.stat1 || "").split(" ").slice(1).join(" ")}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white drop-shadow-lg">{(hero?.stat2 || "").split(" ")[0]}</p>
                  <p className="text-sm text-white/90 font-semibold">{(hero?.stat2 || "").split(" ").slice(1).join(" ")}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white drop-shadow-lg">{(hero?.stat3 || "").split(" ")[0]}</p>
                  <p className="text-sm text-white/90 font-semibold">{(hero?.stat3 || "").split(" ").slice(1).join(" ")}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - India Map Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center items-center -mr-16 xl:-mr-32"
          >
            {hero?.mapImageUrl ? (
              <img
                src={hero.mapImageUrl.startsWith('http') ? hero.mapImageUrl : `${API_BASE_URL}/${hero.mapImageUrl}`}
                alt="Map Presence"
                className="w-full h-auto object-contain max-h-[420px]"
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-white/40 italic">
                Map Image not set
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}


