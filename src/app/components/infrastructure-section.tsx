import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Globe, Printer } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function InfrastructureSection() {
  const [infra, setInfra] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInfra = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/infrastructure`);
        const data = await res.json();
        setInfra(data);
      } catch (err) {
        console.error("Failed to fetch infrastructure data");
      }
    };
    fetchInfra();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/newsletter-subscriptions/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Subscribed successfully!");
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!infra || !infra.enabled) return null;

  return (
    <>
      {/* Infrastructure Header Section - Black BG */}
      <section className="pt-24 pb-12 bg-[#0D0F12] relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center text-white">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold mb-6"
            >
              {infra.title}
            </motion.h2>
            <div className="w-16 h-1 bg-[#00AEEF] mx-auto mb-8 rounded-full"></div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg max-w-4xl mx-auto opacity-90 leading-relaxed font-medium"
            >
              {infra.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact & Newsletter Section - Grey BG */}
      <section className="pt-12 pb-24 bg-[#9CA3AF] relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row shadow-2xl rounded-[40px] overflow-hidden animate-fade-in border border-white/5 bg-[#D1D5DB]">
            {/* Left Side - Contact */}
            <div className="lg:w-[45%] bg-[#002855] p-10 md:p-14 text-white relative">
              <div className="relative z-10">
                <div className="flex gap-1 mb-6">
                  <div className="w-4 h-1 bg-[#F5C542]"></div>
                  <div className="w-4 h-1 bg-[#F5C542]"></div>
                  <div className="w-4 h-1 bg-[#F5C542]"></div>
                </div>
                <h3 className="text-3xl font-bold mb-4">{infra.contactTitle}</h3>
                <h4 className="text-lg font-semibold text-white/80 mb-10">{infra.officeName}</h4>

                <div className="space-y-8">
                  {infra.address && (
                    <div className="flex gap-4 items-start">
                      <MapPin className="w-6 h-6 text-[#F5C542] shrink-0 mt-1" />
                      <p className="text-lg leading-relaxed text-white/90">{infra.address}</p>
                    </div>
                  )}

                  {(infra.phone1 || infra.phone2) && (
                    <div className="flex gap-4 items-start">
                      <Phone className="w-6 h-6 text-[#F5C542] shrink-0 mt-1" />
                      <div className="space-y-1 text-lg">
                        <p>{infra.phone1}</p>
                        <p>{infra.phone2}</p>
                      </div>
                    </div>
                  )}

                  {infra.email && (
                    <div className="flex gap-4 items-start">
                      <Mail className="w-6 h-6 text-[#F5C542] shrink-0 mt-1" />
                      <p className="text-lg">{infra.email}</p>
                    </div>
                  )}

                  {infra.website && (
                    <div className="flex gap-4 items-start">
                      <Globe className="w-6 h-6 text-[#F5C542] shrink-0 mt-1" />
                      <p className="text-lg">{infra.website}</p>
                    </div>
                  )}

                  {infra.fax && (
                    <div className="flex gap-4 items-start">
                      <Printer className="w-6 h-6 text-[#F5C542] shrink-0 mt-1" />
                      <p className="text-lg">{infra.fax}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Newsletter */}
            <div className="lg:w-[55%] p-10 md:p-14 flex flex-col justify-center bg-white">
              <div className="max-w-md mx-auto w-full">
                <div className="flex gap-1 mb-6">
                  <div className="w-4 h-1 bg-[#F5C542]"></div>
                  <div className="w-4 h-1 bg-[#F5C542]"></div>
                  <div className="w-4 h-1 bg-[#F5C542]"></div>
                </div>
                <h3 className="text-3xl font-bold text-[#002855] mb-4">{infra.newsletterTitle}</h3>
                <p className="text-lg text-gray-700 mb-10">{infra.newsletterSubtitle}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white border-none shadow-lg outline-none focus:ring-2 focus:ring-[#002855]/20 text-[#002855] placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Mail"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white border-none shadow-lg outline-none focus:ring-2 focus:ring-[#002855]/20 text-[#002855] placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white border-none shadow-lg outline-none focus:ring-2 focus:ring-[#002855]/20 text-[#002855] placeholder:text-gray-400 resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      disabled={loading}
                      className="w-full h-14 bg-white text-[#00AEEF] hover:bg-white hover:scale-105 transition-all rounded-full font-bold uppercase tracking-wider shadow-xl border-none"
                    >
                      {loading ? 'Subscribing...' : 'SUBSCRIBE NOW'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
