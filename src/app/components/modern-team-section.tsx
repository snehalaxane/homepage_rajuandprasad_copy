import { motion } from 'motion/react';
import { MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function ModernTeamSection() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/team-members`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        // Filter members who are specifically marked to show on home
        const homeMembers = data
          .filter((member: any) => member.showOnHome)
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

        setTeamMembers(homeMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  // Helper to get correct photo URL
  const getPhotoUrl = (photo: string) => {
    if (!photo) return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80';
    if (photo.startsWith('data:') || photo.startsWith('http')) return photo;
    return `${API_BASE_URL.replace(/\/$/, '')}/${photo.replace(/^\//, '')}`;
  };

  if (loading) {
    return (
      <section className="py-20 flex items-center justify-center bg-[#F3F4F6]">
        <Loader2 className="w-8 h-8 text-[#022683] animate-spin" />
      </section>
    );
  }

  // No early return for empty members list to keep section header visible

  return (
    <section id="team" className="py-20 bg-gradient-to-br from-[#F3F4F6] via-[#F3F4F6] to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, #888888 1px, transparent 1px),
              radial-gradient(circle at 80% 80%, #888888 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

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
              Our Leadership
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#888888] to-[#022683] bg-clip-text text-transparent">
              Meet Our
            </span>
            <br />
            <span className="text-[#111111]">Expert Team</span>
          </h2>
          <p className="text-xl text-[#888888] max-w-3xl mx-auto">
            Led by seasoned professionals with decades of experience in accounting, audit, and advisory services
          </p>
        </motion.div>

        {/* Team Autoscrolling Row - Robust Infinite Marquee */}
        <div className="relative mt-12 mb-16 overflow-hidden max-w-[1440px] mx-auto">
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: [0, -1500] }}
            transition={{
              duration: 80,
              repeat: Infinity,
              ease: "linear",
            }}
            whileHover={{
              transition: { duration: 0 } // This helps in pausing or slowing down if we wanted, but let's stick to standard first
            }}
          >
            {/* We duplicate the members list once to create a seamless loop from 0 to -50% */}
            {[...teamMembers, ...teamMembers].map((member, index) => (
              <div
                key={`${member._id}-${index}`}
                className="w-[240px] flex-shrink-0 group relative"
              >
                {/* Premium Card Design */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-[#888888]/20 hover:border-[#022683]/40 transition-all duration-300 h-full flex flex-col">
                  {/* Image Container with Grey Overlay */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#888888]/5">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#888888]/20 via-transparent to-transparent z-10" />
                    <img
                      src={getPhotoUrl(member.photo)}
                      alt={member.name}
                      className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 grayscale-[20%] group-hover:grayscale-0"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-md border border-[#888888]/10">
                        <MapPin className="h-3.5 w-3.5 text-[#888888]" />
                        <span className="text-xs font-bold text-[#888888]">{member.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Member Details */}
                  <div className="p-4 bg-[#F9FAFB] flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-[#111111] mb-1 group-hover:text-[#022683] transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-sm text-[#888888] font-bold tracking-tight">
                        {member.designation}
                      </p>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="mt-5 h-1.5 w-14 bg-[#888888]/20 rounded-full overflow-hidden">
                      <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-[#888888] to-[#022683] transition-all duration-700 ease-out" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Fade edges for 'Glassy' entry/exit feel */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F3F4F6] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F3F4F6] to-transparent z-20 pointer-events-none" />
        </div>

        {/* CTA Button - Grey outline with blue hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Button
            onClick={() => window.location.hash = '#team'}
            className="click-btn btn-style901 px-8 py-6 text-lg rounded-xl transition-all group shadow-xl border-none"
          >
            <span>View Full Team</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}