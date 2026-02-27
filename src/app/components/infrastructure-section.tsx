import { motion } from 'motion/react';
import { Server, Wifi, Shield, Users } from 'lucide-react';

const highlights = [
  {
    icon: Server,
    title: 'Modern Infrastructure',
    description: 'State-of-the-art facilities',
  },
  {
    icon: Wifi,
    title: 'Digital Solutions',
    description: 'Advanced technology systems',
  },
  {
    icon: Shield,
    title: 'Data Security',
    description: 'Secure & compliant',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Skilled professionals',
  },
];

export function InfrastructureSection() {
  return (
    <section id="infrastructure" className="relative py-24 overflow-hidden">
      {/* Dark background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] via-[#033099] to-[var(--primary)]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
      </div>

      {/* Decorative blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20"
            >
              <span className="text-blue-200 text-sm font-medium">World-Class Facilities</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Infrastructure
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-200 leading-relaxed mb-8"
            >
              Our firm is equipped with modern infrastructure and technology to provide efficient
              and effective services to our clients. We maintain well-equipped offices across
              multiple locations with advanced computing facilities, secure data management systems,
              and a professional work environment. Our investment in technology and infrastructure
              ensures seamless service delivery and maintains the highest standards of professional
              excellence.
            </motion.p>

            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all group cursor-pointer"
                  >
                    <Icon className="h-8 w-8 text-blue-300 mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-300">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right - Visual representation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              {/* Decorative grid */}
              <div className="grid grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.05 }}
                    className="aspect-square bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 backdrop-blur-sm hover:from-white/20 hover:to-white/10 transition-all cursor-pointer"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/20 rounded-lg" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute -top-4 -right-4 bg-white text-[var(--primary)] px-6 py-3 rounded-2xl shadow-xl"
              >
                <div className="text-2xl font-bold">7+</div>
                <div className="text-sm">Office Locations</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
