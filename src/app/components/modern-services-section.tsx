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
        <Loader2 className="w-8 h-8 text-[#022683] animate-spin" />
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-white via-[#F3F4F6] to-white relative overflow-hidden">
      {/* Decorative Background Elements - Grey tones */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#888888]/8 to-[#022683]/5 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#888888]/8 to-[#022683]/5 rounded-full blur-3xl -z-0" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-[#888888]/10 text-[#888888] font-semibold rounded-full text-sm border border-[#888888]/20">
              Our Services
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            {introData?.title ? (
              <>
                <span className="text-[#111111]">{introData.title.split(' ').slice(0, -1).join(' ')}</span>
                <br />
                <span className="bg-gradient-to-r from-[#888888] to-[#022683] bg-clip-text text-transparent">
                  {introData.title.split(' ').slice(-1)}
                </span>
              </>
            ) : (
              <>
                <span className="text-[#111111]">Comprehensive</span>
                <br />
                <span className="bg-gradient-to-r from-[#888888] to-[#022683] bg-clip-text text-transparent">
                  Professional Services
                </span>
              </>
            )}
          </h2>
          <p className="text-xl text-[#888888] max-w-3xl mx-auto">
            {introData?.subtitle || 'Delivering expert solutions across audit, taxation, and advisory to help your business thrive'}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || FileCheck;
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative"
              >
                {/* Card - Light grey background */}
                <div className={`h-full bg-[#F3F4F6] backdrop-blur-sm rounded-2xl p-8 border-2 border-[#888888]/20 hover:border-[#022683]/40 transition-all shadow-lg hover:shadow-2xl hover:shadow-[#888888]/10`}>
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#888888]/0 to-[#888888]/0 group-hover:from-[#888888]/5 group-hover:to-[#022683]/5 rounded-2xl transition-all duration-500" />

                  <div className="relative z-10">
                    {/* Icon - Grey by default, blue accent on hover */}
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#888888] to-[#022683] shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        {service.icon?.startsWith('data:') ? (
                          <img src={service.icon} alt={service.name} className="h-8 w-8 object-contain brightness-0 invert" />
                        ) : (
                          <Icon className="h-7 w-7 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Title - Dark text */}
                    <h3 className="text-xl font-bold text-[#111111] mb-3 group-hover:text-[#022683] transition-colors">
                      {service.name}
                    </h3>

                    {/* Description - Grey */}
                    <p className="text-[#888888] leading-relaxed mb-4">
                      {service.shortDescription}
                    </p>

                    {/* Explore Link - Blue on hover */}
                    <button
                      onClick={() => window.location.hash = service.slug.startsWith('#') ? service.slug : `#${service.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#888888] group-hover:text-[#022683] group-hover:gap-3 transition-all"
                    >
                      Explore
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-white/80 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button - Blue for action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Button
            onClick={() => window.location.hash = '#services'}
            className="click-btn btn-style901 px-8 py-6 text-lg rounded-xl shadow-2xl group border-none"
          >
            <span>View All Services</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}