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
      <section className="pt-6 pb-6 mb-6 bg-[#022683] relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-8xl relative z-10">
          <div className="text-center text-white">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold mb-6"
            >
              {infra.title}
            </motion.h2>
            <div className="w-16 h-1 mx-auto mb-4 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl w-full opacity-90 leading-relaxed "
            >
              {infra.description}
            </motion.p>
          </div>
        </div>
      </section>
    </>
  );
}
