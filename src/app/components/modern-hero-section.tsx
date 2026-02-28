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

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Top Left Logo Logo */}
      <div className="absolute top-8 left-8 z-50">
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
            className="h-16 w-auto brightness-0 invert object-contain hover:scale-105 transition-transform duration-300"
          />
        </motion.a>
      </div>

      {/* Background with Gradient and Pattern - var(--secondary) DOMINANT & ATTRACTIVE */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)] via-[var(--secondary)]/95 to-[var(--secondary)]/90">
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
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#aaaaaa]/30 to-[var(--secondary)]/20 blur-3xl"
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
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-[#666666]/30 to-[var(--secondary)]/20 blur-3xl"
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
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-white/10 blur-2xl"
          />
        </div>

        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--secondary)]/80 via-transparent to-[var(--secondary)]/80" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Years Badge */}
            <motion.div
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
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl lg:text-6xl xl:text-2xl font-bold mb-6 leading-tight"
            >
              <span className="text-[#F5C542] text-5xl ">{(hero?.title)}</span>
              <br />
              {/* <span className="text-black drop-shadow-2xl">
                {(hero?.title || "").split(" ").slice(2).join(" ")}
              </span> */}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-white/90 leading-relaxed mb-10 max-w-xl drop-shadow-lg"
            >
              {hero?.description}
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
              className="mt-12 pt-8 border-t border-white/30"
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

          {/* Right Column - Interactive India Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Premium Card Container - GLASSMORPHIC */}
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 overflow-hidden">
              {/* Animated Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-[var(--primary)]/15 rounded-3xl -z-10" />

              {/* Card Header */}
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                  {hero?.presenceTitle}
                </h3>
                <p className="text-white/80 text-sm">
                  {hero?.presenceSubtitle}
                </p>
              </div>

              {/* Interactive Map */}
              <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                {/* @ts-ignore */}
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%", background: 'transparent' }} attributionControl={false} zoomControl={false}>
                  <TileLayer
                    attribution=""
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {locations.filter(loc => loc.latitude && loc.longitude).map((loc) => {
                    const pinColor = loc.pinColor || 'var(--primary)';
                    const label = loc.tooltip || loc.city || '';
                    const isLeft = parseFloat(loc.longitude) < 78.9629; // Approx center of India

                    const customIcon = L.divIcon({
                      className: 'map-marker-container',
                      html: `
                        <div style="position: relative; width: 0; height: 0;">
                          <!-- Pulsating Pin Dot -->
                          <div style="
                            position: absolute;
                            width: 10px;
                            height: 10px;
                            background: ${pinColor};
                            border: 2px solid white;
                            border-radius: 50%;
                            top: 0;
                            left: 0;
                            transform: translate(-50%, -50%);
                            z-index: 2;
                            box-shadow: 0 0 15px ${pinColor}80;
                          ">
                            <div style="
                              position: absolute;
                              inset: -4px;
                              background: ${pinColor};
                              opacity: 0.4;
                              border-radius: 50%;
                              animation: pulse 2s infinite;
                            "></div>
                          </div>

                          <!-- Label Group with Arrow/Line -->
                          <div style="
                            position: absolute;
                            top: 0;
                            ${isLeft ? 'right: 15px;' : 'left: 15px;'}
                            transform: translateY(-50%);
                            display: flex;
                            align-items: center;
                            ${isLeft ? 'flex-direction: row;' : 'flex-direction: row-reverse;'}
                            pointer-events: none;
                          ">
                            <!-- Label Pill -->
                            <div style="
                              background: white;
                              color: #1a1a1a;
                              font-weight: 800;
                              font-size: 10px;
                              letter-spacing: 0.05em;
                              padding: 4px 12px;
                              border-radius: 6px;
                              border: 2px solid ${pinColor};
                              box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                              text-transform: uppercase;
                              white-space: nowrap;
                              pointer-events: auto;
                            ">
                              ${label}
                            </div>
                            <!-- Dotted Leader Line -->
                            <div style="
                              width: 25px;
                              height: 0;
                              border-top: 2px dotted ${pinColor};
                              opacity: 0.6;
                            "></div>
                          </div>
                          <style>
                            @keyframes pulse {
                              0% { transform: scale(1); opacity: 0.4; }
                              100% { transform: scale(2.5); opacity: 0; }
                            }
                          </style>
                        </div>
                      `,
                      iconSize: [0, 0],
                      iconAnchor: [0, 0],
                    });

                    return (
                      <Marker
                        key={loc._id}
                        position={[
                          parseFloat(loc.latitude),
                          parseFloat(loc.longitude),
                        ]}
                        // @ts-ignore
                        icon={customIcon}
                      >
                        {/* @ts-ignore */}
                        <Tooltip
                          direction="top"
                          offset={[0, -10]}
                          opacity={1}
                          permanent={false}
                        >
                          <div className="p-2 min-w-[200px] bg-white rounded-lg border border-gray-100 shadow-2xl">
                            <strong className="text-sm block mb-1 font-bold text-gray-900 border-b pb-1" style={{ color: pinColor }}>{label}</strong>
                            <div className="text-[12px] text-gray-600 leading-snug font-medium break-words whitespace-normal max-w-[220px]">
                              {loc.address}
                            </div>
                          </div>
                        </Tooltip>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-black">
                <MapPin className="h-4 w-4 text-[var(--primary)]" />
                <span>Hover over pins to view location details</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


