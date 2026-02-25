import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



export function ModernHeroSection() {
  const [hero, setHero] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);

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
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background with Gradient and Pattern - #888888 DOMINANT & ATTRACTIVE */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#888888] via-[#888888]/95 to-[#888888]/90">
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
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#aaaaaa]/30 to-[#888888]/20 blur-3xl"
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
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-[#666666]/30 to-[#888888]/20 blur-3xl"
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#888888]/80 via-transparent to-[#888888]/80" />
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
              className="inline-flex items-center gap-3 mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#888888] to-[#022683] blur-xl opacity-50 rounded-full" />
                <div className="relative bg-white rounded-full px-6 py-3 shadow-2xl border-2 border-[#022683]/20">
                  <span className="text-6xl font-bold bg-gradient-to-br from-[#888888] to-[#022683] bg-clip-text text-transparent">
                    {hero?.highlightNumber}
                  </span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white drop-shadow-lg">{(hero?.highlightText || "").split(" ")[0]}</p>
                <p className="text-lg text-white/90 font-semibold drop-shadow-md">{(hero?.highlightText || "").split(" ").slice(1).join(" ")}</p>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white drop-shadow-2xl">{(hero?.title || "").split(" ")[0]} {(hero?.title || "").split(" ")[1]}</span>
              <br />
              <span className="text-white drop-shadow-2xl">
                {(hero?.title || "").split(" ").slice(2).join(" ")}
              </span>
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
                className="px-8 py-6 text-lg bg-[#022683] hover:bg-[#022683]/90 text-white rounded-xl shadow-2xl hover:shadow-[#022683]/30 transition-all group"
              >
                {hero?.ctas?.[0]?.text}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => window.location.href = hero?.ctas?.[1]?.link}
                variant="outline"
                className="px-8 py-6 text-lg bg-white border-2 border-white text-[#888888] hover:bg-white/90 hover:text-[#022683] rounded-xl transition-all shadow-xl"
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
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-[#022683]/15 rounded-3xl -z-10" />

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
                    const pinColor = loc.pinColor || '#022683';
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
                <MapPin className="h-4 w-4 text-[#022683]" />
                <span>Hover over pins to view location details</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

