import { motion } from 'motion/react';
import {
  ClipboardCheck,
  Calculator,
  TrendingUp,
  DollarSign,
  FileText,
  Search,
  ArrowRight,
  FileCheck,
  CheckCircle2,
  Building2,
  Landmark,
  FileSignature,
  Target,
  Briefcase,
  Globe,
  RefreshCw,
  Wallet,
  Shield,
  ClipboardList,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const iconMap: Record<string, any> = {
  ClipboardCheck,
  Calculator,
  TrendingUp,
  DollarSign,
  FileText,
  Search,
  FileCheck,
  CheckCircle2,
  Building2,
  Landmark,
  FileSignature,
  Target,
  Briefcase,
  Globe,
  RefreshCw,
  Wallet,
  Shield,
  ClipboardList
};

export function ModernServicesSection() {
  const [services, setServices] = useState<any[]>([]);
  const [introData, setIntroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const [servicesRes, introRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/services`),
          axios.get(`${API_BASE_URL}/api/service-intro`)
        ]);

        setServices(servicesRes.data.filter((s: any) => s.enabled).slice(0, 6));
        setIntroData(introRes.data);
      } catch (error) {
        console.error('Error fetching services data:', error);
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

  /* 
  // Old Design Commented Out
  return (
    <section id="services" className="py-10 bg-gradient-to-br from-white via-[#F3F4F6] to-white relative overflow-hidden">
      ...
    </section>
  );
  */

  return (
    <section id="services" className="py-16 bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -z-0" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-7xl">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 lg:gap-x-16 gap-y-16 md:gap-y-24">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || FileCheck;
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex items-center h-full"
              >
                {/* Circular Contact/Image */}
                <div className="absolute -top-12 md:top-auto left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 md:-left-12 w-28 h-28 md:w-36 md:h-36 rounded-full border-[6px] border-background bg-white shadow-xl overflow-hidden z-20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 flex-shrink-0 flex items-center justify-center p-3">
                  {service.icon?.startsWith('data:') || (service.icon && service.icon.includes('/')) ? (
                    <img
                      src={service.icon.startsWith('/') && !service.icon.startsWith('data:') ? `${API_BASE_URL}${service.icon}` : service.icon}
                      alt={service.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 bg-gradient-to-br from-white to-gray-100 p-4">
                      <Icon className="w-full h-full" style={{ color: 'var(--primary)' }} />
                    </div>
                  )}
                </div>

                {/* Content Box */}
                <div className="bg-[#E5E7EB] rounded-2xl p-6 pt-16 md:pt-6 md:pl-28 md:ml-6 w-full min-h-[140px] md:min-h-[150px] flex flex-col justify-center shadow-lg transition-all duration-300 group-hover:bg-white group-hover:shadow-2xl border border-transparent group-hover:border-[var(--primary)]/20 relative overflow-hidden">
                  {/* Subtle Decorative Gradient on hover */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity rounded-full blur-3xl -z-0" style={{ backgroundColor: 'var(--primary)', opacity: 0.05 }} />

                  <div className="relative z-10">
                    <h3 className="text-xl md:text-lg font-bold mb-2 leading-tight md:leading-snug transition-colors duration-300 group-hover:text-[var(--primary)]" style={{ color: 'var(--primary)' }}>
                      {service.name}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      {service.shortDescription || service.description}
                    </p>
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
            <Button
              onClick={() => window.location.hash = '#services'}
              className="click-btn text-white px-10 py-4 text-lg rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <span>Explore All Solutions</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
