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
    return `${API_BASE_URL}${photo.startsWith('/') ? '' : '/'}${photo}`;
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

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="group relative"
            >
              {/* Card - Soft grey background */}
              <div className="bg-white backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border-2 border-[#888888]/20 hover:border-[#022683]/40 transition-all">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#888888]/10">
                  {/* Grey Tint Overlay - Softened for better visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#888888]/40 via-transparent to-transparent z-10" />

                  {/* Profile Image - Changed to object-contain for full visibility */}
                  <motion.img
                    src={getPhotoUrl(member.photo)}
                    alt={member.name}
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
                  />

                  {/* City Tag */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                      <MapPin className="h-3 w-3 text-[#888888]" />
                      <span className="text-xs font-bold text-[#888888]">{member.city}</span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 relative bg-[#F3F4F6]">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    {/* Name - Dark text, blue underline on hover */}
                    <h3 className="text-xl font-bold text-[#111111] mb-2 group-hover:text-[#022683] transition-colors">
                      {member.name}
                    </h3>

                    {/* Designation - Grey (#888888) */}
                    <p className="text-sm text-[#888888] font-semibold">
                      {member.designation}
                    </p>
                  </div>

                  {/* Decorative Bar - Grey to blue on hover */}
                  <div className="mt-4 h-1 w-12 bg-[#888888] group-hover:bg-gradient-to-r group-hover:from-[#888888] group-hover:to-[#022683] rounded-full group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
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
            variant="outline"
            className="px-8 py-6 text-lg border-2 border-[#888888] hover:border-[#022683] text-[#888888] hover:text-[#022683] hover:bg-[#022683]/5 rounded-xl transition-all group shadow-lg"
          >
            View Full Team
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}