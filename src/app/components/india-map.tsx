import { useState } from 'react';
import { motion } from 'motion/react';

interface City {
  name: string;
  x: number;
  y: number;
}

const cities: City[] = [
  { name: 'Mumbai', x: 25, y: 58 },
  { name: 'Thane', x: 27, y: 56 },
  { name: 'Bangalore', x: 38, y: 75 },
  { name: 'Chennai', x: 52, y: 80 },
  { name: 'Hyderabad', x: 54, y: 55 },
  { name: 'Vijayawada', x: 60, y: 64 },
  { name: 'Tirupati', x: 52, y: 75 },
];

export function IndiaMap() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-shadow">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#022683] mb-2">Our Presence in India</h3>
        <p className="text-[#888888]">Serving clients across major cities</p>
      </div>

      <div className="relative max-w-md mx-auto">
        {/* India Map Image */}
        <img 
          src="figma:asset/c89e66fc01b498f8ab5b6159390e31a1b9b48b13.png" 
          alt="India Map showing our office locations" 
          className="w-full h-auto drop-shadow-lg"
        />

        {/* Interactive City Markers */}
        {cities.map((city, index) => (
          <motion.div
            key={city.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1, type: 'spring', stiffness: 200 }}
            className="absolute"
            style={{
              left: `${city.x}%`,
              top: `${city.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => setHoveredCity(city.name)}
            onMouseLeave={() => setHoveredCity(null)}
          >
            <motion.div
              animate={{
                scale: hoveredCity === city.name ? 1.3 : 1,
              }}
              className="relative cursor-pointer"
            >
              {/* Pulsing dot */}
              <div 
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  hoveredCity === city.name 
                    ? 'bg-[#022683] shadow-lg shadow-[#022683]/50' 
                    : 'bg-[#0445c5] shadow-md'
                }`}
              />
              
              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: hoveredCity === city.name ? 1 : 0,
                  y: hoveredCity === city.name ? 0 : 10,
                }}
                className="absolute left-1/2 -translate-x-1/2 -top-10 bg-[#022683] text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap pointer-events-none shadow-xl z-10"
              >
                {city.name}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#022683]" />
              </motion.div>

              {/* Glow effect on hover */}
              {hoveredCity === city.name && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-[#022683]"
                />
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* City list pills */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {cities.map((city) => (
          <motion.div
            key={city.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + cities.indexOf(city) * 0.05 }}
            onMouseEnter={() => setHoveredCity(city.name)}
            onMouseLeave={() => setHoveredCity(null)}
            className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all ${
              hoveredCity === city.name
                ? 'bg-[#022683] text-white shadow-lg shadow-[#022683]/30'
                : 'bg-blue-50 text-[#022683] hover:bg-blue-100'
            }`}
          >
            {city.name}
          </motion.div>
        ))}
      </div>
    </div>
  );
}