import { motion } from 'motion/react';
import { Award, MapPin, Users, Shield } from 'lucide-react';

const highlights = [
  {
    icon: Award,
    title: '46+ Years Legacy',
    description: 'Trusted since 1978',
  },
  {
    icon: MapPin,
    title: 'Multi-city Presence',
    description: '7 cities across India',
  },
  {
    icon: Users,
    title: 'Experienced Professionals',
    description: 'Chartered Accountants',
  },
  {
    icon: Shield,
    title: 'Client Commitment',
    description: 'Proactive & timely advice',
  },
];

export function TrustHighlights() {
  return (
    <section id="about" className="py-12 bg-white border-y border-gray-200/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all"
                >
                  <Icon className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}