import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Mail, Phone, MapPin, User, MessageSquare, Copy, Navigation, Clock, Building2, Loader2 } from 'lucide-react';
import { ScrollToTop } from '../components/scroll-to-top';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function ContactPage() {
  const [settings, setSettings] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, fieldsRes, officesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/contact/settings`),
          axios.get(`${API_BASE_URL}/api/contact/fields`),
          axios.get(`${API_BASE_URL}/api/contact/offices`)
        ]);

        setSettings(settingsRes.data);
        setFields(fieldsRes.data.filter((f: any) => f.enabled));
        setBranches(officesRes.data.filter((o: any) => o.enabled));

        // Initialize form data with empty strings based on fields
        const initialForm: any = {};
        fieldsRes.data.forEach((f: any) => {
          if (f.enabled) initialForm[f.label.toLowerCase().replace(/\s+/g, '_')] = '';
        });
        setFormData(initialForm);

      } catch (err) {
        console.error('Error fetching contact data:', err);
        toast.error('Failed to load contact information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Map form data to the backend expected structure
      // The backend expects name, email, mobile, message specifically for ContactInquiry
      // We try to find these in our dynamic fields
      const payload = {
        name: formData.name || formData.full_name || Object.values(formData)[0],
        email: formData.email || formData.email_address,
        mobile: formData.mobile || formData.mobile_number || formData.phone,
        message: formData.message || Object.values(formData)[Object.values(formData).length - 1]
      };

      await axios.post(`${API_BASE_URL}/api/contact-form/submit`, payload);
      toast.success('Thank you! Your inquiry has been submitted.');

      // Reset form
      const resetForm: any = {};
      Object.keys(formData).forEach(key => resetForm[key] = '');
      setFormData(resetForm);
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#022683] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#F7F8FA]">
        {/* Page Header */}
        <section className="pt-32 pb-12 bg-gradient-to-r from-[#022683]/5 to-blue-50/20 border-b border-gray-200">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-[#888888] mb-4">
                <a href="/" className="hover:text-[#022683] transition-colors">Home</a>
                <ChevronRight className="h-4 w-4" />
                <span className="text-[#022683] font-semibold">Contact</span>
              </div>

              {/* Dynamic Title */}
              <h1 className="text-5xl lg:text-6xl font-bold text-[#022683] mb-6">
                {settings?.pageTitle || 'Contact Us'}
              </h1>

              {/* Dynamic Subtitle */}
              <p className="text-lg text-[#888888] leading-relaxed">
                {settings?.pageSubtitle || "Send us your request and we'll get back to you at the earliest."}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quick Contact CTAs */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {/* Call Now */}
                <a
                  href={`tel:${settings?.callNow}`}
                  className="bg-white rounded-2xl border-2 border-gray-200 hover:border-[#022683] p-6 flex items-center gap-4 transition-all hover:shadow-lg group"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#022683] to-[#033aa8] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#888888] mb-1">Call Now</p>
                    <p className="text-lg font-bold text-gray-900 group-hover:text-[#022683] transition-colors">
                      {settings?.callNow || '+91 40 2331 6023'}
                    </p>
                  </div>
                </a>

                {/* Email Us */}
                <a
                  href={`mailto:${settings?.emailUs}`}
                  className="bg-white rounded-2xl border-2 border-gray-200 hover:border-[#022683] p-6 flex items-center gap-4 transition-all hover:shadow-lg group"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#022683] to-[#033aa8] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#888888] mb-1">Email Us</p>
                    <p className="text-lg font-bold text-gray-900 group-hover:text-[#022683] transition-colors">
                      {settings?.emailUs || 'info@rajuprasad.com'}
                    </p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-8 pb-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-[#022683] to-[#033aa8] px-8 py-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {settings?.heading || 'Get in Touch'}
                  </h2>
                  <p className="text-white/80">
                    {settings?.subheading || 'Please share your query. Our team will respond soon.'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {fields.map((field) => {
                      const fieldKey = field.label.toLowerCase().replace(/\s+/g, '_');
                      const Icon = field.fieldType === 'email' ? Mail : field.fieldType === 'tel' ? Phone : User;

                      if (field.fieldType === 'textarea') return null;

                      return (
                        <div key={field._id} className={field.label.toLowerCase().includes('message') ? 'md:col-span-2' : ''}>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            {field.label} {field.required && '*'}
                          </label>
                          <div className="relative">
                            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#888888]" />
                            <input
                              type={field.fieldType}
                              required={field.required}
                              value={formData[fieldKey] || ''}
                              onChange={(e) => setFormData({ ...formData, [fieldKey]: e.target.value })}
                              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#022683] focus:outline-none transition-all text-gray-900"
                              placeholder={field.placeholder || `Enter ${field.label}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {fields.filter(f => f.fieldType === 'textarea').map((field) => {
                    const fieldKey = field.label.toLowerCase().replace(/\s+/g, '_');
                    return (
                      <div key={field._id}>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          {field.label} {field.required && '*'}
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-[#888888]" />
                          <textarea
                            required={field.required}
                            value={formData[fieldKey] || ''}
                            onChange={(e) => setFormData({ ...formData, [fieldKey]: e.target.value })}
                            rows={6}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#022683] focus:outline-none transition-all resize-none text-gray-900"
                            placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-12 py-4 bg-[#022683] hover:bg-[#011952] text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Mail className="h-5 w-5" />
                      )}
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Branch Locations Section */}
        <section className="py-16 bg-white border-t border-gray-200">
          <div className="container mx-auto px-6">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-[#022683] mb-4">
                Our Branch Locations
              </h2>
              <p className="text-lg text-[#888888]">
                Find the nearest Raju & Prasad office
              </p>
            </motion.div>

            {/* Location Cards Grid */}
            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {branches.map((branch, index) => (
                <motion.div
                  key={branch._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all group"
                >
                  {/* Location Header */}
                  <div className="bg-gradient-to-r from-[#022683] to-[#033aa8] px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {branch.cityName}
                      </h3>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="relative h-64 bg-gray-100">
                    {branch.mapEmbed && branch.mapEmbed.includes('/embed') ? (
                      <iframe
                        src={branch.mapEmbed}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="transition-all duration-500 hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gray-50 border-b border-gray-100">
                        <MapPin className="w-8 h-8 text-[#022683] mb-2 opacity-20" />
                        <p className="text-sm text-[#888888]">Map location for {branch.cityName}</p>
                        {branch.mapEmbed && (
                          <a
                            href={branch.mapEmbed}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-xs text-[#022683] font-semibold hover:underline"
                          >
                            View on Google Maps
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Location Details */}
                  <div className="p-6 space-y-4">
                    <div className="mb-2">
                      <p className="text-xs font-bold text-[#022683] uppercase tracking-wider mb-1">{branch.officeName}</p>
                    </div>
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#022683] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 leading-relaxed">
                          {branch.address}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopyAddress(branch.address)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors group/copy"
                        title="Copy address"
                      >
                        {copiedAddress === branch.address ? (
                          <span className="text-xs font-semibold text-green-600">✓</span>
                        ) : (
                          <Copy className="h-4 w-4 text-[#888888] group-hover/copy:text-[#022683] transition-colors" />
                        )}
                      </button>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-[#022683] flex-shrink-0" />
                      <a
                        href={`tel:${branch.phone}`}
                        className="text-sm text-gray-900 hover:text-[#022683] font-semibold transition-colors"
                      >
                        {branch.phone}
                      </a>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-[#022683] flex-shrink-0" />
                      <a
                        href={`mailto:${branch.email}`}
                        className="text-sm text-gray-900 hover:text-[#022683] font-semibold transition-colors"
                      >
                        {branch.email}
                      </a>
                    </div>

                    {/* Directions Button */}
                    <div className="pt-4 border-t border-gray-100">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#022683]/5 hover:bg-[#022683] text-[#022683] hover:text-white font-semibold rounded-xl transition-all group/btn"
                      >
                        <Navigation className="h-4 w-4" />
                        Get Directions
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="py-16 bg-gradient-to-r from-[#022683]/5 to-blue-50/20 border-t border-gray-200">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h3 className="text-2xl font-bold text-[#022683] mb-4">
                Have Questions?
              </h3>
              <p className="text-lg text-[#888888] mb-8">
                Our team is here to help. Reach out to us for any queries related to our services, career opportunities, or general information about Raju & Prasad.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => window.location.href = '/#services'}
                  className="px-6 py-3 bg-white text-[#022683] border-2 border-[#022683] hover:bg-[#022683] hover:text-white font-semibold rounded-xl transition-all"
                >
                  Our Services
                </Button>
                <Button
                  onClick={() => window.location.href = '/#careers'}
                  className="px-6 py-3 bg-[#022683] text-white hover:bg-[#011952] font-semibold rounded-xl transition-all"
                >
                  View Careers
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <ScrollToTop />
    </>
  );
}
