import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import {
  Home,
  ChevronRight,
  Users,
  Network,
  FileText,
  Upload,
  CheckCircle2,
  Calculator,
  Briefcase,
  FileCheck,
  Shield,
  Building2,
  UserCheck,
  Globe,
  Loader2,
  CheckCircle,
  XCircle,
  FileIcon,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { ScrollToTop } from '../components/scroll-to-top';

// Helper to resolve image URLs reliably
const resolveImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const iconMap: Record<string, any> = {
  Network,
  Users,
  Calculator,
  Briefcase,
  FileCheck,
  Shield,
  Building2,
  UserCheck,
  Globe,
  FileText
};

export function NetworkingPage() {
  const [domesticContent, setDomesticContent] = useState<any>(null);
  const [associates, setAssociates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    organisation: '',
    email: '',
    mobile: '',
    profile: null as File | null,
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contentRes, associatesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/networking-content`),
          axios.get(`${API_BASE_URL}/api/networking-associates`)
        ]);

        setDomesticContent(contentRes.data);
        setAssociates(associatesRes.data.filter((a: any) => a.enabled));
      } catch (error) {
        console.error('Error fetching networking data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSendOtp = async () => {
    if (!formData.fullName || !formData.email || !formData.mobile) {
      toast.error('Please fill in Name, Email and Mobile');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.mobile.length !== 10) {
      toast.error('Mobile number must be exactly 10 digits');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/networking-submissions/send-otp`, { email: formData.email });
      setShowOtpModal(true);
      toast.success('Verification code sent to your email');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter 6-digit code');
      return;
    }

    setIsVerifying(true);
    setVerificationError('');
    try {
      // 1. Verify OTP
      await axios.post(`${API_BASE_URL}/api/networking-submissions/verify-otp`, {
        email: formData.email,
        otp
      });

      // 2. Submit Inquiry
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('organisation', formData.organisation);
      data.append('email', formData.email);
      data.append('mobile', formData.mobile);
      if (formData.profile) {
        data.append('profileFile', formData.profile);
      }

      await axios.post(`${API_BASE_URL}/api/networking-submissions`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setVerificationSuccess(true);
      toast.success('Inquiry submitted successfully!');

      setTimeout(() => {
        setShowOtpModal(false);
        setOtp('');
        setVerificationSuccess(false);
        setFormData({
          fullName: '',
          organisation: '',
          email: '',
          mobile: '',
          profile: null,
        });
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
    handleSendOtp();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Force formats
      const allowedExts = ['.pdf', '.doc', '.docx'];
      const fileName = file.name.toLowerCase();
      const isValidExt = allowedExts.some(ext => fileName.endsWith(ext));

      if (!isValidExt) {
        toast.error('Only PDF and DOC formats are allowed');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setFormData({ ...formData, profile: file });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">

      {/* Page Header */}
      <section
        className="relative overflow-hidden w-full aspect-[1920/375] border-b border-gray-100 bg-cover bg-center bg-no-repeat flex items-center" style={{
          backgroundImage: domesticContent?.backgroundImage ? `url(${resolveImageUrl(domesticContent.backgroundImage)})` : 'none',
          backgroundColor: !domesticContent?.backgroundImage ? 'transparent' : 'inherit'
        }}
      >
        {!domesticContent?.backgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary)]/10" />
        )}

        {/* Overlay if there is a background image to ensure text readability */}
        {domesticContent?.backgroundImage && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        )}

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <div className={`flex items-center gap-2 text-sm mb-6 ${domesticContent?.backgroundImage ? 'text-gray-300' : 'text-[var(--secondary)]'}`}>
              <a href="#home" className="hover:text-white transition-colors">
                Home
              </a>
              <ChevronRight className="h-4 w-4" />
              <span className={domesticContent?.backgroundImage ? 'text-white font-semibold' : 'text-[var(--primary)] font-semibold'}>Networking</span>
            </div>

            {/* Title */}
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${domesticContent?.backgroundImage ? 'text-white' : 'text-[var(--primary)]'}`}>
              {domesticContent?.pageTitle || 'Networking'}
            </h1>
            <p className={`text-lg max-w-2xl ${domesticContent?.backgroundImage ? 'text-gray-200' : 'text-[var(--secondary)]'}`}>
              {domesticContent?.pageSubtitle || 'Connect with us to expand professional collaboration across India.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Content Cards */}
            <div className="space-y-8">
              {/* Domestic Networking Card */}
              {domesticContent?.enabled !== false && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-[var(--primary)]/10 rounded-xl">
                      {(() => {
                        const Icon = iconMap[domesticContent?.icon] || Network;
                        return <Icon className="h-6 w-6 text-[var(--primary)]" />;
                      })()}
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--primary)]">
                      {domesticContent?.title || 'Domestic Networking'}
                    </h2>
                  </div>
                  <p className="text-[var(--secondary)] leading-relaxed text-base whitespace-pre-line">
                    {domesticContent?.description || 'Connect with us to expand professional collaboration across India.'}
                  </p>
                </motion.div>
              )}

              {/* Other Associates Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[var(--primary)]/10 rounded-xl">
                    <Users className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--primary)]">
                    Other Associates
                  </h2>
                </div>

                <div className="space-y-3">
                  {associates.map((associate, index) => {
                    const Icon = iconMap[associate.icon] || Building2;
                    return (
                      <motion.div
                        key={associate._id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-[var(--primary)]/5 transition-all duration-300 group border border-transparent hover:border-[var(--primary)]/20"
                      >
                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all">
                          <Icon className="h-5 w-5 text-[var(--primary)]" />
                        </div>
                        <span className="text-[var(--secondary)] font-medium group-hover:text-[var(--primary)] transition-colors">
                          {associate.name}
                        </span>
                      </motion.div>
                    );
                  })}
                  {associates.length === 0 && (
                    <div className="text-center py-8 text-[var(--secondary)] opacity-50 italic">
                      No associates listed yet.
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-32 h-fit"
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-[var(--primary)]/10 rounded-xl">
                    <FileText className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--primary)]">
                    Contact for Networking
                  </h2>
                </div>

                <p className="text-xs text-red-500 font-semibold mb-6 uppercase tracking-wide">
                  All fields are mandatory
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--primary)] mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all text-gray-800"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Organisation */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--primary)] mb-2">
                      Organisation
                    </label>
                    <input
                      type="text"
                      value={formData.organisation}
                      onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all text-gray-800"
                      placeholder="Enter your organisation"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--primary)] mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all text-gray-800"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--primary)] mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      maxLength={10}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all text-gray-800"
                      placeholder="Enter 10-digit mobile number"
                    />
                  </div>

                  {/* Profile of the Firm */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--primary)] mb-2">
                      Profile of the Firm
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="profile-upload"
                      />
                      <label
                        htmlFor="profile-upload"
                        className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-[var(--primary)] cursor-pointer transition-all bg-gray-50 hover:bg-[var(--primary)]/5 group"
                      >
                        <Upload className="h-5 w-5 text-[var(--secondary)] group-hover:text-[var(--primary)] transition-colors" />
                        <span className="text-sm text-[var(--secondary)] group-hover:text-[var(--primary)] transition-colors">
                          {formData.profile ? formData.profile.name : 'Upload PDF/DOC (max 5MB)'}
                        </span>
                      </label>
                    </div>
                    <p className="text-xs text-[var(--secondary)] mt-2">
                      Supported formats: PDF, DOC, DOCX
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[var(--primary)] hover:bg-[#011952] text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[var(--primary)]/30 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit</span>
                        <CheckCircle2 className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
                <p className="text-gray-600">Your networking inquiry has been sent.</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--primary)] mb-2">Verify email</h3>
                <p className="text-[var(--secondary)] mb-8 text-sm leading-relaxed">
                  Enter the 6-digit code sent to<br />
                  <span className="text-[var(--primary)] font-semibold">{formData.email}</span>
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
                      {isVerifying ? 'Verifying...' : 'Verify & Submit'}
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

    </div>
  );
}

