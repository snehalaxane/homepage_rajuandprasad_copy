import { motion } from 'motion/react';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from './ui/button';
import indiaMapImage from 'figma:asset/c89e66fc01b498f8ab5b6159390e31a1b9b48b13.png';

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 pt-32 pb-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-[#022683]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-[#022683]/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* 46 - Extremely Large and Dominant */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-6"
            >
              <span
                className="text-[140px] lg:text-[200px] xl:text-[240px] font-black leading-none text-[#022683] block"
                style={{ lineHeight: '0.85' }}
              >
                46
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Years of Service with{' '}
              <span className="text-[#022683]">
                Commitment
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg lg:text-xl text-[#888888] mb-8 leading-relaxed"
            >
              Our vision is to extend expert based services all over the country and to get ultimate recognition in providing services across the globe
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="bg-[#022683] hover:bg-[#011952] text-white shadow-lg shadow-[#022683]/30 group px-8 py-6 text-lg"
                asChild
              >
                <a href="#services">
                  Explore Services
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#022683] text-[#022683] hover:bg-[#022683] hover:text-white group px-8 py-6 text-lg"
                asChild
              >
                <a href="#contact">
                  <Phone className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Contact Us
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - India Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow effect behind map */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#022683]/10 to-blue-400/10 blur-3xl scale-110 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />

              {/* Map container with shadow */}
              <motion.div
                className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100"
                initial={{ scale: 0.9, rotateY: 10 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.img
                  src={indiaMapImage}
                  alt="Our presence across India - 7 office locations"
                  className="w-full h-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                />
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-[#022683]/5 rounded-full blur-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}