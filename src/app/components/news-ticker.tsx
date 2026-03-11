import { motion } from 'motion/react';
import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function NewsTicker() {
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/news-ticker`);
                if (!res.ok) throw new Error("Fetch failed");
                const data = await res.json();
                setNewsItems(data.filter((i: any) => i.enabled));
            } catch (error) {
                console.error("Failed to fetch news ticker", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

    const newsText = newsItems.length > 0
        ? newsItems.map(i => i.content).join(' \u00A0\u00A0\u00A0 • \u00A0\u00A0\u00A0 ')
        : "Welcome to Raju and Prasad Chartered Accountants. Stay tuned for expert financial insights and updates.";

    if (isLoading && newsItems.length === 0) return (
        <div className="bg-white border-b-2 border-blue-900 h-10 flex items-center px-4">
            <div className="animate-pulse flex space-x-4 w-full">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    );

    return (
        <div className="bg-white border-b-2 border-blue-900 overflow-hidden flex h-10 items-center shadow-sm relative z-40">
            {/* News Label with Chevron Shape */}
            <div className="relative bg-blue-900 text-white pl-8 pr-4 h-full flex items-center font-bold z-20 shrink-0">
                NEWS
                <div
                    className="absolute top-0 right-[-16px] h-0 w-0 border-y-[20px] border-y-transparent border-l-[16px] border-l-blue-900 z-10"
                />
            </div>

            {/* Scrolling Text Container */}
            <div className="flex-1 overflow-hidden relative h-full flex items-center ml-4">
                <motion.div
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{
                        duration: newsText.length / 5, // Dynamic duration based on length
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="whitespace-nowrap text-blue-900 font-semibold text-sm lg:text-base uppercase tracking-wider"
                >
                    {newsText}
                </motion.div>
            </div>
        </div>
    );
}
