import React from 'react';
import { motion } from 'framer-motion';

interface City {
    id: string;
    name: string;
    x: number; // percentage of svg width
    y: number; // percentage of svg height
    side: 'left' | 'right';
    color: string;
}

const cities: City[] = [
    { id: 'thane', name: 'THANE', x: 28, y: 38, side: 'left', color: '#60a5fa' },
    { id: 'mumbai', name: 'MUMBAI', x: 28, y: 44, side: 'left', color: '#3b82f6' },
    { id: 'bangalore', name: 'BANGALORE', x: 38, y: 68, side: 'left', color: '#fb923c' },
    { id: 'hyderabad', name: 'HYDERABAD', x: 55, y: 52, side: 'right', color: '#ef4444' },
    { id: 'vijayawada', name: 'VIJAYAWADA', x: 62, y: 58, side: 'right', color: '#ef4444' },
    { id: 'tirupati', name: 'TIRUPATI', x: 58, y: 72, side: 'right', color: '#ef4444' },
    { id: 'chennai', name: 'CHENNAI', x: 62, y: 76, side: 'right', color: '#ef4444' },
];

export function InteractiveIndiaMap() {
    return (
        <div className="relative w-full h-full min-h-[500px] bg-transparent flex items-center justify-center overflow-visible">
            <svg
                viewBox="0 0 1000 1000"
                className="w-full h-full max-h-[600px] drop-shadow-2xl"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Simplified India Map Group */}
                <g transform="translate(100, 50) scale(0.8)">
                    {/* Main India Outline - Light grey */}
                    <path
                        d="M500,10 L550,50 L600,80 L650,150 L700,200 L750,250 L800,400 L750,600 L650,800 L500,950 L350,800 L250,600 L200,400 L250,250 L350,150 L450,50 Z"
                        fill="#f3f4f6"
                        stroke="#d1d5db"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />

                    {/* Highlighted Regions */}

                    {/* Western Region (Maharashtra) - Blue */}
                    <motion.path
                        d="M300,350 L450,350 L480,450 L420,550 L300,500 Z"
                        fill="#3b82f6"
                        stroke="#2563eb"
                        strokeWidth="2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.9 }}
                        whileHover={{ scale: 1.02, opacity: 1 }}
                    />

                    {/* Southern Region (Karnataka) - Orange */}
                    <motion.path
                        d="M320,550 L450,550 L420,750 L350,780 L300,700 Z"
                        fill="#f97316"
                        stroke="#ea580c"
                        strokeWidth="2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.9 }}
                        whileHover={{ scale: 1.02, opacity: 1 }}
                    />

                    {/* Southeastern Region (AP/Telangana) - Red */}
                    <motion.path
                        d="M480,450 L600,420 L680,600 L550,780 L450,750 L480,550 Z"
                        fill="#ef4444"
                        stroke="#dc2626"
                        strokeWidth="2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.9 }}
                        whileHover={{ scale: 1.02, opacity: 1 }}
                    />
                </g>

                {/* Connection Lines and Labels */}
                {cities.map((city, index) => {
                    const isLeft = city.side === 'left';

                    // Map coordinates
                    const pinX = 100 + (city.x / 100 * 800);
                    const pinY = 50 + (city.y / 100 * 800);

                    // Label coordinates
                    const labelX = isLeft ? 100 : 900;
                    const labelY = 150 + (index * 110);

                    return (
                        <g key={city.id}>
                            {/* Animated Dotted Line */}
                            <motion.path
                                d={`M ${pinX} ${pinY} L ${isLeft ? pinX - 40 : pinX + 40} ${pinY} L ${isLeft ? labelX + 60 : labelX - 60} ${labelY} L ${labelX} ${labelY}`}
                                fill="none"
                                stroke="#64748b"
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.4 }}
                                transition={{ duration: 1.5, delay: index * 0.1, ease: "easeInOut" }}
                            />

                            {/* Pin point */}
                            <motion.g
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                            >
                                <circle cx={pinX} cy={pinY} r="7" fill="white" stroke={city.color} strokeWidth="2.5" />
                                <circle cx={pinX} cy={pinY} r="3" fill={city.color} />
                            </motion.g>

                            {/* Label Pill */}
                            <foreignObject
                                x={isLeft ? labelX - 160 : labelX}
                                y={labelY - 22}
                                width="160"
                                height="45"
                            >
                                <div className={`flex w-full h-full ${isLeft ? 'justify-end' : 'justify-start'} items-center px-2`}>
                                    <motion.div
                                        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1 + index * 0.1 }}
                                        className="px-4 py-1.5 bg-white border-2 rounded-lg shadow-xl flex items-center justify-center min-w-[110px]"
                                        style={{ borderColor: city.color }}
                                    >
                                        <span className="text-[12px] font-black text-gray-900 tracking-tightest uppercase font-sans">
                                            {city.name}
                                        </span>
                                    </motion.div>
                                </div>
                            </foreignObject>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

