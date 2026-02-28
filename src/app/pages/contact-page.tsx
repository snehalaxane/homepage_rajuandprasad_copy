import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Mail, Phone, MapPin, User, MessageSquare, Copy, Navigation, Clock, Building2, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { ScrollToTop } from '../components/scroll-to-top';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper to resolve image URLs reliably
const resolveImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

export function ContactPage() {
  const [settings, setSettings] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

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

  // Helper to find email in dynamic formData
  const getEmailValue = () => {
    const emailKey = Object.keys(formData).find(k => k.includes('email') || k.includes('mail'));
    return emailKey ? formData[emailKey] : '';
  };

  const getPhoneValue = () => {
    const phoneKey = Object.keys(formData).find(k => k.includes('mobile') || k.includes('phone') || k.includes('tel') || k.includes('contact'));
    return phoneKey ? formData[phoneKey] : '';
  };

  const handleSendOtp = async () => {
    const email = getEmailValue();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/contact-form/send-otp`, { email });
      setIsOtpSent(true);
      setShowOtpModal(true);
      toast.success('Verification code sent to your email');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    setVerificationError('');
    try {
      const email = getEmailValue();
      // 1. Verify OTP
      await axios.post(`${API_BASE_URL}/api/contact-form/verify-otp`, { email, otp });

      // 2. Submit Form
      await axios.post(`${API_BASE_URL}/api/contact-form/submit`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      setVerificationSuccess(true);
      toast.success('Thank you! Your inquiry has been submitted.');

      // Close modal after success animation
      setTimeout(() => {
        setShowOtpModal(false);
        setOtp('');
        setVerificationSuccess(false);
        const resetForm: any = {};
        Object.keys(formData).forEach(key => resetForm[key] = '');
        setFormData(resetForm);
        setIsOtpSent(false);
      }, 2000);

    } catch (err: any) {
      console.error('Final Submission Error:', err);
      const msg = err.response?.data?.message || 'Verification failed. Please try again.';
      setVerificationError(msg);
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Phone Number (10 digits)
    const phone = getPhoneValue();
    if (phone && phone.length !== 10) {
      toast.error('Mobile number must be exactly 10 digits');
      return;
    }

    // First step: Trigger OTP
    handleSendOtp();
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#F7F8FA]">
        {/* Page Header */}
        <section
          className="relative overflow-hidden w-full aspect-[1920/375] border-b border-gray-100 bg-cover bg-center bg-no-repeat flex items-center" style={{
            backgroundImage: settings?.backgroundImage ? `url(${resolveImageUrl(settings.backgroundImage)})` : 'none',
            backgroundColor: !settings?.backgroundImage ? 'transparent' : 'inherit'
          }}
        >
          {!settings?.backgroundImage && (
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-blue-50/20" />
          )}

          {/* Overlay if there is a background image to ensure text readability */}
          {settings?.backgroundImage && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          )}

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              {/* Breadcrumb */}
              <div className={`flex items-center gap-2 text-sm mb-4 ${settings?.backgroundImage ? 'text-gray-300' : 'text-white'}`}>
                <a href="/" className={`transition-colors ${settings?.backgroundImage ? 'text-gray-300 hover:text-white' : 'hover:text-[var(--primary)]'}`}>Home</a>
                <ChevronRight className="h-4 w-4" />
                <span className={settings?.backgroundImage ? 'text-white font-semibold' : 'text-[var(--primary)] font-semibold'}>Contact</span>
              </div>

              {/* Dynamic Title */}
              <h1 className={`text-5xl lg:text-6xl font-bold mb-6 ${settings?.backgroundImage ? 'text-white' : 'text-[var(--primary)]'}`}>
                {settings?.pageTitle || 'Contact Us'}
              </h1>

              {/* Dynamic Subtitle */}
              <p className={`text-lg leading-relaxed ${settings?.backgroundImage ? 'text-gray-200' : 'text-[var(--secondary)]'}`}>
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
                  className="bg-white rounded-2xl border-2 border-gray-200 hover:border-[var(--primary)] p-6 flex items-center gap-4 transition-all hover:shadow-lg group"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#033aa8] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--secondary)] mb-1">Call Now</p>
                    <p className="text-lg font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors">
                      {settings?.callNow || '+91 40 2331 6023'}
                    </p>
                  </div>
                </a>

                {/* Email Us */}
                <a
                  href={`mailto:${settings?.emailUs}`}
                  className="bg-white rounded-2xl border-2 border-gray-200 hover:border-[var(--primary)] p-6 flex items-center gap-4 transition-all hover:shadow-lg group"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#033aa8] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--secondary)] mb-1">Email Us</p>
                    <p className="text-lg font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors">
                      {settings?.emailUs || 'support@rajuandprasad.com'}
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
                <div className="bg-gradient-to-r from-[var(--primary)] to-[#033aa8] px-8 py-8">
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
                            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--secondary)]" />
                            <input
                              type={field.fieldType === 'tel' ? 'text' : field.fieldType}
                              required={field.required}
                              value={formData[fieldKey] || ''}
                              onChange={(e) => {
                                let val = e.target.value;
                                if (field.fieldType === 'tel') {
                                  val = val.replace(/\D/g, '').slice(0, 10);
                                }
                                setFormData({ ...formData, [fieldKey]: val });
                              }}
                              pattern={field.fieldType === 'tel' ? '[0-9]{10}' : undefined}
                              inputMode={field.fieldType === 'tel' ? 'numeric' : undefined}
                              maxLength={field.fieldType === 'tel' ? 10 : undefined}
                              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[var(--primary)] focus:outline-none transition-all text-gray-900"
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
                          <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-[var(--secondary)]" />
                          <textarea
                            required={field.required}
                            value={formData[fieldKey] || ''}
                            onChange={(e) => setFormData({ ...formData, [fieldKey]: e.target.value })}
                            rows={6}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[var(--primary)] focus:outline-none transition-all resize-none text-gray-900"
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
                      className="w-full md:w-auto px-5 py-6 bg-[var(--primary)] text-white text-lg font-semibold rounded-xl btn-shimmer flex items-center justify-center gap-2 border-none"
                    >
                      <span className="flex items-center gap-2 relative z-10">
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Mail className="h-5 w-5" />
                        )}
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </span>
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
              <h2 className="text-3xl lg:text-4xl font-bold text-[var(--primary)] mb-4">
                Our Branch Locations
              </h2>
              <p className="text-lg text-[var(--secondary)]">
                Find the nearest Raju & Prasad office
              </p>
            </motion.div>

            {/* Location Cards Grid */}
            <div className="grid lg:grid-cols-4 gap-8 max-w-9xl mx-auto">
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
                  <div className="bg-gradient-to-r from-[var(--primary)] to-[#033aa8] px-6 py-4">
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
                        <MapPin className="w-8 h-8 text-[var(--primary)] mb-2 opacity-20" />
                        <p className="text-sm text-[var(--secondary)]">Map location for {branch.cityName}</p>
                        {branch.mapEmbed && (
                          <a
                            href={branch.mapEmbed}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-xs text-[var(--primary)] font-semibold hover:underline"
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
                      <p className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-1">{branch.officeName}</p>
                    </div>
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[var(--primary)] mt-0.5 flex-shrink-0" />
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
                          <Copy className="h-4 w-4 text-[var(--secondary)] group-hover/copy:text-[var(--primary)] transition-colors" />
                        )}
                      </button>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-[var(--primary)] flex-shrink-0" />
                      <a
                        href={`tel:${branch.phone}`}
                        className="text-sm text-gray-900 hover:text-[var(--primary)] font-semibold transition-colors"
                      >
                        {branch.phone}
                      </a>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-[var(--primary)] flex-shrink-0" />
                      <a
                        href={`mailto:${branch.email}`}
                        className="text-sm text-gray-900 hover:text-[var(--primary)] font-semibold transition-colors"
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
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[var(--primary)]/5 hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white font-semibold rounded-xl transition-all group/btn"
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
        <section className="py-16 bg-gradient-to-r from-[var(--primary)]/5 to-blue-50/20 border-t border-gray-200">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h3 className="text-2xl font-bold text-[var(--primary)] mb-4">
                Have Questions?
              </h3>
              <p className="text-lg text-[var(--secondary)] mb-8">
                Our team is here to help. Reach out to us for any queries related to our services, career opportunities, or general information about Raju & Prasad.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => window.location.href = '/#services'}
                  className="px-6 py-3 bg-white text-[var(--primary)] border-2 border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white font-semibold rounded-xl transition-all"
                >
                  Our Services
                </Button>
                <Button
                  onClick={() => window.location.href = '/#careers'}
                  className="px-6 py-3 bg-[var(--primary)] text-white hover:bg-[#011952] font-semibold rounded-xl transition-all"
                >
                  View Careers
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
          >
            {verificationSuccess ? (
              <div className="py-8 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Verified!</h3>
                <p className="text-gray-600">Your message has been sent successfully.</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--primary)] mb-2">Verify your email</h3>
                <p className="text-[var(--secondary)] mb-8 text-sm">
                  We've sent a 6-digit verification code to <span className="text-[var(--primary)] font-semibold">{getEmailValue()}</span>
                </p>

                <form onSubmit={handleVerifyAndSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, ''));
                          if (verificationError) setVerificationError('');
                        }}
                        className={`w-full text-center text-4xl font-bold tracking-[0.5em] py-4 border-2 rounded-2xl focus:outline-none transition-all placeholder:text-gray-200 ${verificationError ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-[var(--primary)]'
                          }`}
                        placeholder="000000"
                      />
                    </div>
                    {verificationError && (
                      <p className="text-red-500 text-xs font-semibold flex items-center justify-center gap-1">
                        <XCircle className="w-3 h-3" /> {verificationError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      disabled={isVerifying || otp.length !== 6}
                      className="w-full py-4 bg-[var(--primary)] hover:bg-[#011952] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      {isVerifying ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {isVerifying ? 'Verifying...' : 'Verify & Send Message'}
                    </Button>

                    <button
                      type="button"
                      onClick={() => { setShowOtpModal(false); setOtp(''); setVerificationError(''); }}
                      className="text-sm font-semibold text-[var(--secondary)] hover:text-[var(--primary)] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <p className="mt-8 text-xs text-[var(--secondary)]">
                  Didn't receive the code? <button type="button" onClick={handleSendOtp} className="text-[var(--primary)] font-bold hover:underline">Resend</button>
                </p>
              </>
            )}
          </motion.div>
        </div>
      )}

      <ScrollToTop />
    </>
  );
}

