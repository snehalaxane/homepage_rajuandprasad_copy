import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, Plus, Minus, Briefcase, MapPin, Clock, Users, Mail, Upload, X } from 'lucide-react';
import { ScrollToTop } from '../components/scroll-to-top';
import { Button } from '../components/ui/button';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface CareerIntro {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  enabled: boolean;
}

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload your resume');
      return;
    }

    setSubmitting(true);
    setStatus('idle');

    try {
      const data = new FormData();
      data.append('name', formData.fullName);
      data.append('email', formData.email);
      data.append('mobile', formData.mobile);
      data.append('role', jobTitle);
      data.append('message', formData.message);
      data.append('resume', file);

      const res = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setFormData({ fullName: '', email: '', mobile: '', message: '' });
          setFile(null);
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
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
              <div className="sticky top-0 bg-gradient-to-r from-[#022683] to-[#033aa8] px-8 py-6 flex items-center justify-between z-10">
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#022683] focus:outline-none transition-all"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#022683] focus:outline-none transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#022683] focus:outline-none transition-all"
                    placeholder="+91 XXXXX XXXXX"
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
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${file ? 'border-green-500 bg-green-50/30' : 'border-gray-300 hover:border-[#022683]'}`}>
                      <Upload className={`h-10 w-10 mx-auto mb-3 ${file ? 'text-green-500' : 'text-[#888888]'}`} />
                      <p className="text-sm text-gray-900 font-semibold mb-1">
                        {file ? file.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-[#888888]">
                        PDF, DOC, DOCX (Max. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#022683] focus:outline-none transition-all resize-none"
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
                    className="flex-1 bg-[#022683] hover:bg-[#011952] text-white h-10 rounded-xl"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </form>
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#022683]"></div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
        {/* Page Header */}
        <section className="pt-32 pb-12 bg-gradient-to-r from-[#022683]/5 to-blue-50/20 border-b border-gray-100">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-[#888888] mb-4">
                <a href="#home" className="hover:text-[#022683] transition-colors">Home</a>
                <ChevronRight className="h-4 w-4" />
                <span className="text-[#022683] font-semibold">Careers</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl lg:text-6xl font-bold text-[#022683] mb-6">
                {careerIntro?.title || 'Careers'}
              </h1>

              {/* Subtitle */}
              <p className="text-lg lg:text-xl text-[#888888] leading-relaxed">
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
                <div className="border-l-4 border-[#022683] pl-6">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                    Build Your Career with Raju & Prasad
                  </h2>
                  <div className="space-y-4 text-base lg:text-lg text-[#888888] leading-relaxed">
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
                <h2 className="text-3xl lg:text-4xl font-bold text-[#022683] mb-4">
                  Current Openings
                </h2>
                <p className="text-lg text-[#888888]">
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
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#888888]" />
                    <input
                      type="text"
                      placeholder="Search openings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#022683] focus:outline-none transition-all text-gray-900"
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
                        ? 'bg-[#022683] text-white shadow-lg'
                        : 'bg-gray-100 text-[#888888] hover:bg-gray-200'
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
                      ? 'border-[#022683] shadow-2xl'
                      : 'border-gray-100 hover:border-[#022683]/30'
                      }`}
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => setExpandedId(expandedId === opening._id ? null : opening._id)}
                      className="w-full px-8 py-6 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 text-left">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#022683] to-[#033aa8] flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                            {opening.role}
                          </h3>
                          {opening.shortDescription && (
                            <p className="text-sm text-[#888888] mb-1">
                              {opening.shortDescription}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-3 mt-3">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#022683]">
                              <MapPin className="h-3 w-3" />
                              {opening.location}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#022683]">
                              <Clock className="h-3 w-3" />
                              {opening.experience}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#022683]">
                              <Users className="h-3 w-3" />
                              {opening.employmentType}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${expandedId === opening._id
                        ? 'bg-[#022683] border-[#022683]'
                        : 'border-gray-300 hover:border-[#022683]'
                        }`}>
                        {expandedId === opening._id ? (
                          <Minus className="h-5 w-5 text-white" />
                        ) : (
                          <Plus className="h-5 w-5 text-[#888888]" />
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
                                <p className="text-[#888888] leading-relaxed">
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
                                        <li key={idx} className="flex items-start gap-2 text-[#888888]">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#022683] mt-2 flex-shrink-0" />
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
                                        <li key={idx} className="flex items-start gap-2 text-[#888888]">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#022683] mt-2 flex-shrink-0" />
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
                              <div className="sticky top-24 bg-gradient-to-br from-[#022683]/5 to-blue-50/30 rounded-2xl border-2 border-[#022683]/20 p-6 space-y-4">
                                <h4 className="text-lg font-bold text-gray-900">
                                  Ready to Apply?
                                </h4>
                                <p className="text-sm text-[#888888]">
                                  Join our team and be part of our legacy of excellence.
                                </p>

                                <Button
                                  onClick={() => handleApply(opening.role)}
                                  className="w-full bg-[#022683] hover:bg-[#011952] text-white shadow-lg hover:shadow-xl transition-all h-10 rounded-xl"
                                >
                                  <Briefcase className="mr-2 h-4 w-4" />
                                  Apply for Job
                                </Button>

                                <div className="pt-4 border-t border-gray-200">
                                  <p className="text-xs text-[#888888] mb-2 font-semibold">
                                    Or send your resume to:
                                  </p>
                                  <a
                                    href="mailto:careers@rajuprasad.com"
                                    className="flex items-center gap-2 text-sm font-semibold text-[#022683] hover:text-[#011952] transition-colors"
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
                    <Search className="h-12 w-12 text-[#888888]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No openings found
                  </h3>
                  <p className="text-[#888888] mb-6">
                    Try adjusting your search criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-6 py-3 bg-[#022683] text-white rounded-xl font-semibold hover:bg-[#011952] transition-all"
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
