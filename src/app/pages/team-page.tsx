import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Linkedin, Twitter, Facebook, Mail, Phone, MapPin, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper to resolve image URLs reliably
const resolveImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

interface Partner {
  _id: string;
  name: string;
  designation: string;
  city: string;
  bio: string;
  photo: string;
  showOnHome: boolean;
  showOnTeam: boolean;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

export function TeamPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [intro, setIntro] = useState({
    title: 'The Team',
    description: 'Meet our experienced & dedicated Chartered Accountant professionals',
    backgroundImage: ''
  });
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [gridOffset, setGridOffset] = useState(0);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/team-members`);
        if (res.ok) {
          const data = await res.json();
          const teamMembers = data.filter((member: Partner) => member.showOnTeam);
          setPartners(teamMembers);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    const fetchTeamIntro = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/team-intro`);
        if (res.ok) {
          const data = await res.json();
          setIntro({
            title: data.title || 'The Team',
            description: data.description || 'Meet our experienced & dedicated Chartered Accountant professionals',
            backgroundImage: data.backgroundImage || ''
          });
        }
      } catch (error) {
        console.error('Error fetching team intro:', error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchTeamMembers(), fetchTeamIntro()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Auto-scroll effect for the main partner carousel
  useEffect(() => {
    if (partners.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 6000); // Auto-scroll every 6 seconds

    return () => clearInterval(interval);
  }, [partners.length, currentPartnerIndex]);

  // Dynamic rotation for the decorative grid images
  useEffect(() => {
    if (partners.length <= 4) return;

    const interval = setInterval(() => {
      setGridOffset((prev) => (prev + 1) % partners.length);
    }, 4000); // Rotate grid images every 4 seconds

    return () => clearInterval(interval);
  }, [partners.length]);

  const currentPartner = partners[currentPartnerIndex];

  // Get current 4 partners for the decorative grid
  const gridPartners = partners.length > 0
    ? Array.from({ length: 4 }, (_, i) => partners[(gridOffset + i) % partners.length])
    : [];

  const handlePrevious = () => {
    if (partners.length === 0) return;
    setDirection(-1);
    setCurrentPartnerIndex((prev) => (prev === 0 ? partners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (partners.length === 0) return;
    setDirection(1);
    setCurrentPartnerIndex((prev) => (prev === partners.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header / Hero Banner */}
      <section
        className="relative overflow-hidden w-full aspect-[1920/395] border-b border-gray-100 bg-cover bg-center bg-no-repeat flex items-center" style={{
          backgroundImage: intro.backgroundImage ? `url(${resolveImageUrl(intro.backgroundImage)})` : 'none',
          backgroundColor: !intro.backgroundImage ? 'transparent' : 'inherit'
        }}
      >
        {!intro.backgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-gray-50/20" />
        )}

        {/* Overlay if there is a background image to ensure text readability */}
        {intro.backgroundImage && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        )}

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex justify-center items-center">
            {/* Left: Page Title */}
            <motion.div
              className="text-center max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Breadcrumb */}
              <div className="flex items-center justify-center gap-2 text-sm text-white mb-6">
                <a href="#home" className="hover:text-white transition-colors">
                  Home
                </a>
                <ChevronRight className="h-4 w-4" />
                <span className="text-white font-medium">The Team</span>
              </div>

              <h1 className={`text-5xl lg:text-6xl font-bold mb-4 ${intro.backgroundImage ? 'text-white' : 'text-gray-900'}`}>
                {intro.title.split(' ').length > 1 ? (
                  <>
                    {intro.title.split(' ').slice(0, -1).join(' ')} <span className="text-white">{intro.title.split(' ').slice(-1)}</span>
                  </>
                ) : (
                  <span className="text-white">{intro.title}</span>
                )}
              </h1>

              <p className={`text-lg leading-relaxed ${intro.backgroundImage ? 'text-gray-200' : 'text-[var(--secondary)]'}`}>
                {intro.description}
              </p>
            </motion.div>

            {/* Right: Decorative Illustration */}
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex justify-center items-center"
            >
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-blue-100/50 rounded-full blur-3xl" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-gray-200/50">
                  <div className="grid grid-cols-2 gap-4">
                    {gridPartners.length > 0 ? (
                      <AnimatePresence mode="popLayout">
                        {gridPartners.map((member, i) => (
                          <motion.div
                            key={`${member._id}-${i}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                              duration: 0.5,
                              delay: i * 0.1,
                              type: 'spring',
                              stiffness: 100
                            }}
                            className="aspect-square relative overflow-hidden rounded-2xl group border border-gray-100 shadow-sm"
                          >
                            {member.photo ? (
                              <img
                                src={resolveImageUrl(member.photo)}
                                alt={member.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/20 to-blue-100" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                              <p className="text-white text-[10px] font-bold leading-tight">{member.name}</p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    ) : (
                      [1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                          className="aspect-square bg-gradient-to-br from-[var(--primary)]/20 to-blue-100 rounded-2xl"
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div> */}
          </div>
        </div>
      </section>

      {/* Intro Content Section */}

      {/* Intro Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-10 shadow-lg border border-gray-100 overflow-hidden">

              {/* Accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--primary)] to-blue-400" />

              <p className="text-lg text-[var(--secondary)] leading-relaxed pl-6">
                The Firm has a blend of professionals with experience in the fields of
                <span className="text-gray-700 font-medium"> Auditing</span>,
                <span className="text-gray-700 font-medium"> Taxation</span>,
                <span className="text-gray-700 font-medium"> Project Consultancy</span>,
                <span className="text-gray-700 font-medium"> Management Services</span>,
                <span className="text-gray-700 font-medium"> Enterprise Restructuring</span>,
                <span className="text-gray-700 font-medium"> Industry</span>,
                <span className="text-gray-700 font-medium"> Banking</span>,
                <span className="text-gray-700 font-medium"> Securities</span>,
                <span className="text-gray-700 font-medium"> Secretarial Services</span>,
                <span className="text-gray-700 font-medium"> Computer Aided Auditing Techniques</span>,
                <span className="text-gray-700 font-medium"> Systems Design</span>,
                <span className="text-gray-700 font-medium"> Implementation</span> and
                <span className="text-gray-700 font-medium"> Information Systems Audit</span>.
              </p>

            </div>
          </motion.div>
        </div>
      </section>




      {/* Our Partners Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
        <div className="container mx-auto px-6">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm font-semibold inline-block mb-4">
              Leadership
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Our <span className="text-[var(--primary)]">Partners</span>
            </h2>
          </motion.div>

          {/* Partner Card */}
          <div className="max-w-6xl mx-auto mb-12">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xl">
                <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin mb-4" />
                <p className="text-[var(--secondary)]">Loading team members...</p>
              </div>
            ) : partners.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xl">
                <p className="text-[var(--secondary)]">No team members found.</p>
              </div>
            ) : (
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentPartner._id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="grid lg:grid-cols-5 gap-0">
                    {/* Left: Profile Photo */}
                    <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-[var(--primary)]/5 to-blue-50">
                      <div className="aspect-[4/5] lg:aspect-auto lg:h-full relative">
                        <img
                          src={resolveImageUrl(currentPartner.photo)}
                          alt={currentPartner.name}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/20 to-transparent" />
                      </div>
                    </div>

                    {/* Right: Partner Info */}
                    <div className="lg:col-span-3 p-10 lg:p-12 flex flex-col justify-center">
                      {/* Location Tag */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="px-4 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm font-semibold flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {currentPartner.city}
                        </div>
                      </div>

                      {/* Name */}
                      <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        {currentPartner.name}
                      </h3>
                      <p className="text-xl font-semibold text-[var(--primary)] mb-6">{currentPartner.designation}</p>

                      {/* Description */}
                      <p className="text-lg text-[var(--secondary)] leading-relaxed mb-8">
                        {currentPartner.bio}
                      </p>

                      {/* Contact Info */}
                      <div className="space-y-3 mb-8">
                        {currentPartner.email && (
                          <a
                            href={`mailto:${currentPartner.email}`}
                            className="flex items-center gap-3 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[var(--primary)]/10 transition-colors">
                              <Mail className="h-5 w-5" />
                            </div>
                            <span>{currentPartner.email}</span>
                          </a>
                        )}
                        {currentPartner.phone && (
                          <a
                            href={`tel:${currentPartner.phone}`}
                            className="flex items-center gap-3 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[var(--primary)]/10 transition-colors">
                              <Phone className="h-5 w-5" />
                            </div>
                            <span>{currentPartner.phone}</span>
                          </a>
                        )}
                      </div>

                      {/* Social Icons */}
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3"></p>
                        <div className="flex gap-3">
                          {currentPartner.linkedin && (
                            <motion.a
                              href={currentPartner.linkedin}
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-all group"
                              aria-label="LinkedIn"
                            >
                              <Linkedin className="h-5 w-5" />
                            </motion.a>
                          )}
                          {currentPartner.twitter && (
                            <motion.a
                              href={currentPartner.twitter}
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-all group"
                              aria-label="Twitter"
                            >
                              <Twitter className="h-5 w-5" />
                            </motion.a>
                          )}
                          {currentPartner.facebook && (
                            <motion.a
                              href={currentPartner.facebook}
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-all group"
                              aria-label="Facebook"
                            >
                              <Facebook className="h-5 w-5" />
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              {/* Previous Button */}
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevious}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[var(--primary)] text-[var(--primary)] rounded-full hover:bg-[var(--primary)] hover:text-white transition-all shadow-lg hover:shadow-xl"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="font-semibold">Previous Partner</span>
              </motion.button>

              {/* Partner Counter */}
              <div className="text-center">
                <p className="text-sm text-[var(--secondary)] mb-2">Partner</p>
                <p className="text-2xl font-bold text-[var(--primary)]">
                  {partners.length > 0 ? currentPartnerIndex + 1 : 0} / {partners.length}
                </p>
              </div>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-full hover:bg-[#011952] transition-all shadow-lg shadow-[var(--primary)]/30 hover:shadow-xl"
              >
                <span className="font-semibold">Next Partner</span>
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Partner Selector Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {partners.map((partner, index) => (
                <motion.button
                  key={partner._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setDirection(index > currentPartnerIndex ? 1 : -1);
                    setCurrentPartnerIndex(index);
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${index === currentPartnerIndex
                    ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)]'
                    }`}
                >
                  {partner.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
