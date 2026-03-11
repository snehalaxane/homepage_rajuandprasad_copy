import { motion } from 'motion/react';

export function NewsTicker() {
    const newsText = "Our vision is to extend expert based services all over the country and to get ultimate recognition in providing services across the globe. Our vision is to extend expert based services all over the country and to get ultimate recognition in providing services across the globe.";

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
                        duration: 40,
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
