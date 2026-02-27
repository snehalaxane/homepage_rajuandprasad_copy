import { motion } from "motion/react";
import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface StatItem {
  _id: string;
  number: string;
  label: string;
  icon: string;
}

interface AboutResponse {
  _id: string;
  enabled: boolean;
  title: string;
  description: string;
  stats: StatItem[];
}

export function ModernStatsSection() {
  const [statsData, setStatsData] = useState<AboutResponse | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/about`);
        const data: AboutResponse = await res.json();
        setStatsData(data);
      } catch (error) {
        console.error("Failed to fetch stats section", error);
      }
    };

    fetchStats();
  }, []);

  if (!statsData || !statsData.enabled) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-[#F3F4F6] via-[#F3F4F6] to-[var(--secondary)]/10 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent">
              {statsData.title}
            </span>
          </h2>

          <p className="text-xl text-[var(--secondary)] max-w-2xl mx-auto">
            {statsData.description}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {statsData.stats.map((stat, index) => (
            <motion.div
              key={stat._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="h-full bg-white rounded-2xl p-8 border-2 border-[var(--secondary)]/20 hover:border-[var(--primary)]/40 transition-all shadow-lg hover:shadow-2xl relative">

                <div className="relative z-10">

                  {/* Dynamic Icon Image */}
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={`${API_BASE_URL}${stat.icon}`}
                        alt={stat.label}
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                  </div>

                  {/* Number */}
                  <div className="text-5xl font-bold mb-3 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent">
                    {stat.number}
                  </div>

                  {/* Label */}
                  <h3 className="text-lg font-bold text-[#111111] mb-2">
                    {stat.label}
                  </h3>
                </div>

                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-[var(--secondary)]/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
