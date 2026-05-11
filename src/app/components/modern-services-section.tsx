import { motion } from 'motion/react';
import { FileCheck, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function ModernServicesSection() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/homepage-services`);
        setServices(res.data.filter((s: any) => s.enabled));
      } catch (error) {
        console.error('Error fetching homepage services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 flex items-center justify-center bg-[#F3F4F6]">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
      </section>
    );
  }

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-2 bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -z-0" />

      <div className="container mx-auto px-2 md:px-12 relative z-10 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block relative">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight" style={{ color: 'var(--primary)' }}>
              Our Services
            </h2>
            <div className="w-12 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 lg:gap-x-3 gap-y-4 md:gap-y-20">
          {services.map((service, index) => {
            const imageUrl = service.image
              ? service.image.startsWith('http')
                ? service.image
                : `${API_BASE_URL}/${service.image}`
              : null;

            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* ── MOBILE LAYOUT (< md): stacked card ── */}
                <div className="flex flex-col items-center gap-0 md:hidden group">
                  {/* Circular image on top */}
                  <div className="w-14 h-14 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden flex-shrink-0 z-10 transition-transform duration-500 group-hover:scale-105">
                    {imageUrl ? (
                      <img src={imageUrl} alt={service.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white to-gray-100 p-3">
                        <FileCheck className="w-full h-full" style={{ color: 'var(--primary)' }} />
                      </div>
                    )}
                  </div>
                  {/* Content card below */}
                  <div className="bg-[#E5E7EB] rounded-2xl px-4 pt-10 pb-4 w-[92%] -mt-5 text-center shadow-md transition-all duration-300 group-hover:bg-white group-hover:shadow-lg border border-transparent group-hover:border-[var(--primary)]/20">
                    <h3 className="text-sm font-bold mb-1 transition-colors duration-300 group-hover:text-[var(--primary)]" style={{ color: 'var(--primary)' }}>
                      {service.name}
                    </h3>
                    <p className="text-gray-800 text-xs font-medium line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* ── DESKTOP LAYOUT (md+): absolute circular image + horizontal card ── */}
                <div className="hidden md:flex items-center h-full md:ml-8 group relative">
                  {/* Circular Image - Left side */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-16 h-16 md:w-28 md:h-28 rounded-full border-[6px] border-[#E5E7EB] bg-white shadow-xl overflow-hidden z-20 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6 flex-shrink-0 flex items-center justify-center">
                    {imageUrl ? (
                      <img src={imageUrl} alt={service.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white to-gray-100 p-4">
                        <FileCheck className="w-full h-full" style={{ color: 'var(--primary)' }} />
                      </div>
                    )}
                  </div>
                  {/* Content Box */}
                  <div className="bg-[#E5E7EB] rounded-2xl py-5 pl-2 md:pl-14 w-[80%] h-[100px] md:h-[120px] flex flex-col justify-center shadow-lg transition-all duration-300 group-hover:bg-white group-hover:shadow-2xl border border-transparent group-hover:border-[var(--primary)]/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity rounded-full blur-3xl -z-0" style={{ backgroundColor: 'var(--primary)', opacity: 0.05 }} />
                    <div className="relative z-2">
                      <h3 className="text-sm font-bold mb-1 mt-2 leading-tight md:leading-snug transition-colors duration-300 group-hover:text-[var(--primary)]" style={{ color: 'var(--primary)' }}>
                        {service.name}
                      </h3>
                      <p className="text-black text-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Optional View All Button */}
        {services.length >= 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-24"
          >
            {/* Uncomment to show a "View All" button */}
          </motion.div>
        )}
      </div>
    </section>
  );
}