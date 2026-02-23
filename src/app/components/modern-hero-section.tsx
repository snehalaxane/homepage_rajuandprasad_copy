import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MapPin, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon not showing
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});


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
            {/* Premium Card Container */}
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-[#888888]/20">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#888888]/5 to-[#022683]/10 rounded-3xl blur-2xl -z-10" />

              {/* Card Header */}
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#888888] to-[#022683] bg-clip-text text-transparent mb-2">
                  {hero?.presenceTitle}
                </h3>
                <p className="text-[#888888] text-sm">
                  {hero?.presenceSubtitle}
                </p>
              </div>

              {/* Interactive Map */}
              <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl">
                {/* @ts-ignore */}
                <MapContainer
                  center={[20.5937, 78.9629]} // India center
                  zoom={5}
                  style={{ height: "100%", width: "100%" }}
                  attributionControl={false}
                  zoomControl={false}
                >
                  <TileLayer
                    attribution=""
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {locations.filter(loc => loc.latitude && loc.longitude).map((loc) => {
                    // Create a dynamic custom pin based on loc.pinColor
                    const customIcon = L.divIcon({
                      className: 'custom-div-icon',
                      html: `<div style="background-color: ${loc.pinColor || '#022683'}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                               <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; transform: rotate(45deg);"></div>
                             </div>`,
                      iconSize: [24, 24],
                      iconAnchor: [12, 24],
                      popupAnchor: [0, -24]
                    });

                    return (
                      <Marker
                        key={loc._id}
                        position={[
                          parseFloat(loc.latitude),
                          parseFloat(loc.longitude),
                        ]}
                        icon={customIcon}
                        eventHandlers={{
                          mouseover: (e: any) => {
                            e.target.openPopup();
                          },
                          mouseout: (e: any) => {
                            e.target.closePopup();
                          }
                        }}
                      >
                        <Popup>
                          <div className="p-1 min-w-[150px]">
                            <strong style={{ color: loc.pinColor || '#022683' }} className="text-lg block mb-1">{loc.city}</strong>
                            <div className="text-xs text-gray-600 leading-relaxed">{loc.address}</div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#888888]">
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

