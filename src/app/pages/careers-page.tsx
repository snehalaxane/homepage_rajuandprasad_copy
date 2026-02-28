import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ChevronRight,
  Plus,
  Minus,
  Briefcase,
  MapPin,
  Clock,
  Users,
  Mail,
  Upload,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { ScrollToTop } from '../components/scroll-to-top';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface CareerIntro {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  enabled: boolean;
  backgroundImage: string;
}

// Helper to resolve image URLs reliably
const resolveImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

interface Job {
  _id: string;
  role: string;
  shortDescription: string;
  description: string;
  requirements: string;
  responsibilities: string;
  location: string;
  experience: string;
  employmentType: string;
  image: string;
  applyLink: string;
  enabled: boolean;
}

interface JobCategory {
  _id: string;
  name: string;
  enabled: boolean;
  jobs: Job[];
}

interface FlattenedJob extends Job {
  categoryName: string;
}

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

function ApplyModal({ isOpen, onClose, jobTitle }: ApplyModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // OTP States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

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

    if (!file) {
      toast.error('Please upload your resume');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/applications/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      if (res.ok) {
        setShowOtpModal(true);
        toast.success('Verification code sent to your email');
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to send verification code');
      }
    } catch (err) {
      toast.error('Failed to connect to server');
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
      const verifyRes = await fetch(`${API_BASE_URL}/api/applications/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      if (!verifyRes.ok) {
        const error = await verifyRes.json();
        throw new Error(error.message || 'Verification failed');
      }

      // 2. Submit Application
      const data = new FormData();
      data.append('name', formData.fullName);
      data.append('email', formData.email);
      data.append('mobile', formData.mobile);
      data.append('role', jobTitle);
      data.append('message', formData.message);
      data.append('resume', file!);

      const res = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        setVerificationSuccess(true);
        toast.success('Application submitted successfully!');

        setTimeout(() => {
          setShowOtpModal(false);
          setOtp('');
          setVerificationSuccess(false);
          onClose();
          setFormData({ fullName: '', email: '', mobile: '', message: '' });
          setFile(null);
        }, 2000);
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (err: any) {
      setVerificationError(err.message);
      toast.error(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendOtp();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[var(--primary)] to-[#033aa8] px-8 py-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Apply for Position</h2>
                  <p className="text-white/80 text-sm">{jobTitle}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {status === 'success' && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-semibold">
                    Application submitted successfully!
                  </div>
                )}
                {status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-semibold">
                    Failed to submit application. Please try again.
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--primary)] focus:outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--primary)] focus:outline-none transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--primary)] focus:outline-none transition-all"
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>

                {/* Role (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Role Applying For
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={jobTitle}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700"
                  />
                </div>

                {/* Upload Resume */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Upload Resume *
                  </label>
                  <label className="block">
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${file ? 'border-green-500 bg-green-50/30' : 'border-gray-300 hover:border-[var(--primary)]'}`}>
                      <Upload className={`h-10 w-10 mx-auto mb-3 ${file ? 'text-green-500' : 'text-[var(--secondary)]'}`} />
                      <p className="text-sm text-gray-900 font-semibold mb-1">
                        {file ? file.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-[var(--secondary)]">
                        PDF, WORD (Max. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0] || null;
                        if (selectedFile) {
                          const allowed = ['.pdf', '.doc', '.docx'];
                          const name = selectedFile.name.toLowerCase();
                          if (!allowed.some(ext => name.endsWith(ext))) {
                            toast.error('Only PDF and Word documents are allowed');
                            return;
                          }
                          if (selectedFile.size > 5 * 1024 * 1024) {
                            toast.error('File size must be under 5MB');
                            return;
                          }
                        }
                        setFile(selectedFile);
                      }}
                    />
                  </label>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--primary)] focus:outline-none transition-all resize-none"
                    placeholder="Tell us why you're interested in this position..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={submitting}
                    className="flex-1 border-2 border-gray-300 hover:bg-gray-50 h-10 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[var(--primary)] hover:bg-[#011952] text-white h-10 rounded-xl"
                  >
                    {submitting ? 'Sending Request...' : 'Apply Now'}
                  </Button>
                </div>
              </form>

              {/* OTP Modal Layer */}
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
                        <p className="text-gray-600">Application submitted successfully.</p>
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
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export function CareersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string>('');

  const [careerIntro, setCareerIntro] = useState<CareerIntro | null>(null);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching career data from:', API_BASE_URL);
        const [introRes, jobsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/career-intro`),
          fetch(`${API_BASE_URL}/api/job-categories`)
        ]);

        if (introRes.ok) {
          const data = await introRes.json();
          console.log('Career Intro received:', data);
          setCareerIntro(data);
        }

        if (jobsRes.ok) {
          const data = await jobsRes.json();
          console.log('Job data received:', data);
          if (Array.isArray(data)) {
            setJobCategories(data);

            // Auto-expand first opening
            const firstCat = data.find((c: any) => c.enabled !== false);
            if (firstCat && firstCat.jobs?.length > 0) {
              const firstJob = firstCat.jobs.find((j: any) => j.enabled !== false);
              if (firstJob) setExpandedId(firstJob._id);
            }
          } else {
            console.error('Expected array of jobs but got:', data);
            setJobCategories([]);
          }
        } else {
          console.error('Jobs fetch failed with status:', jobsRes.status);
          const errorText = await jobsRes.text();
          console.error('Error response:', errorText);
        }
      } catch (error) {
        console.error('Error fetching career data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = ['All', ...jobCategories.filter(c => c.enabled !== false).map(c => c.name)];

  // Flatten and filter openings
  const allOpenings: FlattenedJob[] = jobCategories
    .filter(cat => cat.enabled !== false)
    .flatMap(cat =>
      (cat.jobs || [])
        .filter(job => job.enabled !== false)
        .map(job => ({ ...job, categoryName: cat.name }))
    );

  const filteredOpenings = allOpenings.filter(opening => {
    const role = opening.role || '';
    const description = opening.description || '';
    const shortDescription = opening.shortDescription || '';
    const location = opening.location || '';
    const searchQueryLower = searchQuery.toLowerCase();

    const matchesSearch =
      role.toLowerCase().includes(searchQueryLower) ||
      description.toLowerCase().includes(searchQueryLower) ||
      shortDescription.toLowerCase().includes(searchQueryLower) ||
      location.toLowerCase().includes(searchQueryLower);

    const matchesCategory = selectedCategory === 'All' || opening.categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleApply = (jobTitle: string) => {
    setSelectedJob(jobTitle);
    setShowApplyModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
        {/* Page Header */}
        <section
          className="relative overflow-hidden w-full aspect-[1920/375] border-b border-gray-100 bg-cover bg-center bg-no-repeat flex items-center" style={{
            backgroundImage: careerIntro?.backgroundImage ? `url(${resolveImageUrl(careerIntro.backgroundImage)})` : 'none',
            backgroundColor: !careerIntro?.backgroundImage ? 'transparent' : 'inherit'
          }}
        >
          {!careerIntro?.backgroundImage && (
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-blue-50/20" />
          )}

          {/* Overlay if there is a background image to ensure text readability */}
          {careerIntro?.backgroundImage && (
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
              <div className={`flex items-center gap-2 text-sm mb-4 ${careerIntro?.backgroundImage ? 'text-gray-300' : 'text-[var(--secondary)]'}`}>
                <a href="#home" className={`transition-colors ${careerIntro?.backgroundImage ? 'text-gray-300 hover:text-white' : 'hover:text-[var(--primary)]'}`}>Home</a>
                <ChevronRight className="h-4 w-4" />
                <span className={careerIntro?.backgroundImage ? 'text-white font-semibold' : 'text-[var(--primary)] font-semibold'}>Careers</span>
              </div>

              {/* Title */}
              <h1 className={`text-5xl lg:text-6xl font-bold mb-6 ${careerIntro?.backgroundImage ? 'text-white' : 'text-[var(--primary)]'}`}>
                {careerIntro?.title || 'Careers'}
              </h1>

              {/* Subtitle */}
              <p className={`text-lg lg:text-xl leading-relaxed ${careerIntro?.backgroundImage ? 'text-gray-200' : 'text-[var(--secondary)]'}`}>
                {careerIntro?.subtitle || 'Join a team built on professionalism, growth, and integrity.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Intro Content Block */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 lg:p-12">
                <div className="border-l-4 border-[var(--primary)] pl-6">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                    Build Your Career with Raju & Prasad
                  </h2>
                  <div className="space-y-4 text-base lg:text-lg text-[var(--secondary)] leading-relaxed">
                    {careerIntro?.description ? (
                      careerIntro.description.split('\n').map((para, idx) => (
                        para.trim() && <p key={idx}>{para}</p>
                      ))
                    ) : (
                      <>
                        <p>Raju and Prasad is one of the leading firms of Chartered Accountants in India with a legacy spanning over 46 years.</p>
                        <p>We believe our people are our greatest asset...</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Career Openings Section */}
        <section className="py-12 pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-[var(--primary)] mb-4">
                  Current Openings
                </h2>
                <p className="text-lg text-[var(--secondary)]">
                  Explore opportunities to join our growing team
                </p>
              </motion.div>

              {/* Search and Filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
              >
                <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                  {/* Search */}
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--secondary)]" />
                    <input
                      type="text"
                      placeholder="Search openings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--primary)] focus:outline-none transition-all text-gray-900"
                    />
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === category
                        ? 'bg-[var(--primary)] text-white shadow-lg'
                        : 'bg-gray-100 text-[var(--secondary)] hover:bg-gray-200'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Accordion Items */}
              <div className="space-y-4">
                {filteredOpenings.map((opening, index) => (
                  <motion.div
                    key={opening._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className={`bg-white rounded-2xl shadow-lg border-2 transition-all overflow-hidden ${expandedId === opening._id
                      ? 'border-[var(--primary)] shadow-2xl'
                      : 'border-gray-100 hover:border-[var(--primary)]/30'
                      }`}
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => setExpandedId(expandedId === opening._id ? null : opening._id)}
                      className="w-full px-8 py-6 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 text-left">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#033aa8] flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                            {opening.role}
                          </h3>
                          {opening.shortDescription && (
                            <p className="text-sm text-[var(--secondary)] mb-1">
                              {opening.shortDescription}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-3 mt-3">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
                              <MapPin className="h-3 w-3" />
                              {opening.location}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
                              <Clock className="h-3 w-3" />
                              {opening.experience}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
                              <Users className="h-3 w-3" />
                              {opening.employmentType}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${expandedId === opening._id
                        ? 'bg-[var(--primary)] border-[var(--primary)]'
                        : 'border-gray-300 hover:border-[var(--primary)]'
                        }`}>
                        {expandedId === opening._id ? (
                          <Minus className="h-5 w-5 text-white" />
                        ) : (
                          <Plus className="h-5 w-5 text-[var(--secondary)]" />
                        )}
                      </div>
                    </button>

                    {/* Accordion Content */}
                    <AnimatePresence>
                      {expandedId === opening._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-8 grid lg:grid-cols-3 gap-8">
                            {/* Left Side - Job Details */}
                            <div className="lg:col-span-2 space-y-6">
                              {/* Description */}
                              <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-3">
                                  About the Role
                                </h4>
                                <p className="text-[var(--secondary)] leading-relaxed">
                                  {opening.description}
                                </p>
                              </div>

                              {/* Requirements */}
                              {opening.requirements && (
                                <div>
                                  <h4 className="text-lg font-bold text-gray-900 mb-3">
                                    Requirements
                                  </h4>
                                  <ul className="space-y-2">
                                    {opening.requirements.split('\n').map((req, idx) => (
                                      req.trim() && (
                                        <li key={idx} className="flex items-start gap-2 text-[var(--secondary)]">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                                          <span>{req}</span>
                                        </li>
                                      )
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Responsibilities */}
                              {opening.responsibilities && (
                                <div>
                                  <h4 className="text-lg font-bold text-gray-900 mb-3">
                                    Key Responsibilities
                                  </h4>
                                  <ul className="space-y-2">
                                    {opening.responsibilities.split('\n').map((resp, idx) => (
                                      resp.trim() && (
                                        <li key={idx} className="flex items-start gap-2 text-[var(--secondary)]">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                                          <span>{resp}</span>
                                        </li>
                                      )
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Right Side - Sticky CTA Card */}
                            <div className="lg:col-span-1">
                              <div className="sticky top-24 bg-gradient-to-br from-[var(--primary)]/5 to-blue-50/30 rounded-2xl border-2 border-[var(--primary)]/20 p-6 space-y-4">
                                <h4 className="text-lg font-bold text-gray-900">
                                  Ready to Apply?
                                </h4>
                                <p className="text-sm text-[var(--secondary)]">
                                  Join our team and be part of our legacy of excellence.
                                </p>

                                <Button
                                  onClick={() => handleApply(opening.role)}
                                  className="w-full bg-[var(--primary)] hover:bg-[#011952] text-white shadow-lg hover:shadow-xl transition-all h-10 rounded-xl"
                                >
                                  <Briefcase className="mr-2 h-4 w-4" />
                                  Apply for Job
                                </Button>

                                <div className="pt-4 border-t border-gray-200">
                                  <p className="text-xs text-[var(--secondary)] mb-2 font-semibold">
                                    Or send your resume to:
                                  </p>
                                  <a
                                    href="mailto:careers@rajuprasad.com"
                                    className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:text-[#011952] transition-colors"
                                  >
                                    <Mail className="h-4 w-4" />
                                    careers@rajuprasad.com
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* No Results */}
              {filteredOpenings.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                    <Search className="h-12 w-12 text-[var(--secondary)]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No openings found
                  </h3>
                  <p className="text-[var(--secondary)] mb-6">
                    Try adjusting your search criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[#011952] transition-all"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </main>

      <ScrollToTop />
      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        jobTitle={selectedJob}
      />
    </>
  );
}

