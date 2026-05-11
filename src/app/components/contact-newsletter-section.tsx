import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function ContactNewsletterSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact-form/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send verification code');

      setIsOtpSent(true);
      setShowOtpModal(true);
      toast.success('Verification code sent to your email');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
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
      // 1. Verify OTP
      const verifyRes = await fetch(`${API_BASE_URL}/api/contact-form/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.message || 'Verification failed');

      // 2. Submit Form
      const res = await fetch(`${API_BASE_URL}/api/newsletter-subscriptions/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setVerificationSuccess(true);
        toast.success("Subscribed successfully!");

        setTimeout(() => {
          setShowOtpModal(false);
          setOtp('');
          setVerificationSuccess(false);
          setFormData({ name: '', email: '', message: '' });
          setIsOtpSent(false);
        }, 2000);
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (err: any) {
      const msg = err.message || 'Verification failed. Please try again.';
      setVerificationError(msg);
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section id="contact" className="py-6 bg-background from-gray-50 to-white">
      <div className="container mx-auto px-6 flex justify-center">
        <div className="w-full max-w-xl mx-auto">
          {/* Left - Contact Us */}
          {/* <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          > */}
          {/* <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-200/50">
            <h2 className="text-3xl font-bold text-[var(--primary)] mb-2">Contact Us</h2>
            <p className="text-[var(--secondary)] mb-8">Get in touch with our team</p>

            <div className="space-y-6"> */}
          {/* Head Office */}
          {/* <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-2xl p-6 border border-blue-100"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Head Office</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Door No. 6-3-1090/A/1/1, 3rd Floor,<br />
                        Beside Laxmi Hyundai Showroom,<br />
                        Rajbhavan Road, Somajiguda,<br />
                        Hyderabad - 500082, Telangana
                      </p>
                    </div>
                  </div>
                </motion.div> */}

          {/* Phone */}
          {/* <motion.div   
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Phone className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <div className="text-sm text-[var(--secondary)] mb-1">Phone</div>
                    <div className="font-semibold text-gray-900">+91 40 2331 4657</div>
                  </div>
                </motion.div> */}

          {/* Email */}
          {/* <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Mail className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <div className="text-sm text-[var(--secondary)] mb-1">Email</div>
                    <div className="font-semibold text-gray-900">info@rajuprasad.com</div>
                  </div>
                </motion.div> */}
          {/* </div>
      </div>
    </motion.div> */}

          {/* Right - Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="bg-[#ffffff] rounded-3xl p-8 lg:p-10 text-white h-full">
              <h2 className="text-3xl font-bold mb-2 text-[var(--primary)]">Newsletter</h2>
              <p className="text-black mb-8 text-xl font-semibold">
                Subscribe to our Newsletter
              </p>

              <form className="space-y-5" onSubmit={handleSendOtp}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <label className="block text-m font-medium mb-2 text-[var(--primary)]">Enter Name</label>
                  <Input
                    placeholder="Your full name"
                    className="w-full px-4 py-6 rounded-xl border border-blue-900 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all text-gray-800"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <label className="block text-m font-medium mb-2 text-[var(--primary)]">Your Mail</label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-6 rounded-xl border border-blue-900 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all text-gray-800"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label className="block text-m font-medium mb-2 text-[var(--primary)]">Your Message</label>
                  <Textarea
                    placeholder="Tell us how we can help you..."
                    rows={4}
                    className="w-full px-4 py-6 rounded-xl border border-blue-900 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all text-gray-800"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[var(--primary)] hover:bg-[#002855] text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/30 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Subscribe Now
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div >
      </div >

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              {verificationSuccess ? (
                <div className="py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Verified!</h3>
                  <p className="text-gray-600">You have been successfully subscribed.</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--primary)] mb-2">Verify your email</h3>
                  <p className="text-[var(--secondary)] mb-8 text-sm">
                    We've sent a 6-digit verification code to <span className="text-[var(--primary)] font-semibold">{formData.email}</span>
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
                        className="w-full py-4 bg-[var(--primary)] hover:bg-[#002855] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        {isVerifying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        {isVerifying ? 'Verifying...' : 'Verify & Subscribe'}
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
      </AnimatePresence>
    </section >
  );
}
