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
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.mobile) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('organisation', formData.organisation);
    data.append('email', formData.email);
    data.append('mobile', formData.mobile);
    if (formData.profile) {
      data.append('profileFile', formData.profile);
    }

    try {
      await axios.post(`${API_BASE_URL}/api/networking-submissions`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Your networking inquiry has been submitted successfully!');
      setFormData({
        fullName: '',
        organisation: '',
        email: '',
        mobile: '',
        profile: null,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit inquiry. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
        <Loader2 className="w-12 h-12 text-[#022683] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">

      {/* Page Header */}
      <section className="pt-32 pb-12 bg-gradient-to-r from-[#022683]/5 to-[#022683]/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-6">
              <a href="/" className="text-[#888888] hover:text-[#022683] transition-colors">
                <Home className="h-4 w-4" />
              </a>
              <ChevronRight className="h-4 w-4 text-[#888888]" />
              <span className="text-[#022683] font-semibold">Networking</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-[#022683] mb-4">
              {domesticContent?.pageTitle || 'Networking'}
            </h1>
            <p className="text-lg text-[#888888] max-w-2xl">
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
                    <div className="p-3 bg-[#022683]/10 rounded-xl">
                      {(() => {
                        const Icon = iconMap[domesticContent?.icon] || Network;
                        return <Icon className="h-6 w-6 text-[#022683]" />;
                      })()}
                    </div>
                    <h2 className="text-2xl font-bold text-[#022683]">
                      {domesticContent?.title || 'Domestic Networking'}
                    </h2>
                  </div>
                  <p className="text-[#888888] leading-relaxed text-base whitespace-pre-line">
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
                  <div className="p-3 bg-[#022683]/10 rounded-xl">
                    <Users className="h-6 w-6 text-[#022683]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#022683]">
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
                        className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-[#022683]/5 transition-all duration-300 group border border-transparent hover:border-[#022683]/20"
                      >
                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all">
                          <Icon className="h-5 w-5 text-[#022683]" />
                        </div>
                        <span className="text-[#888888] font-medium group-hover:text-[#022683] transition-colors">
                          {associate.name}
                        </span>
                      </motion.div>
                    );
                  })}
                  {associates.length === 0 && (
                    <div className="text-center py-8 text-[#888888] opacity-50 italic">
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
                  <div className="p-3 bg-[#022683]/10 rounded-xl">
                    <FileText className="h-6 w-6 text-[#022683]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#022683]">
                    Contact for Networking
                  </h2>
                </div>

                <p className="text-xs text-red-500 font-semibold mb-6 uppercase tracking-wide">
                  All fields are mandatory
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-[#022683] mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#022683] focus:ring-2 focus:ring-[#022683]/20 outline-none transition-all text-gray-800"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Organisation */}
                  <div>
                    <label className="block text-sm font-semibold text-[#022683] mb-2">
                      Organisation
                    </label>
                    <input
                      type="text"
                      value={formData.organisation}
                      onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#022683] focus:ring-2 focus:ring-[#022683]/20 outline-none transition-all text-gray-800"
                      placeholder="Enter your organisation"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-sm font-semibold text-[#022683] mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#022683] focus:ring-2 focus:ring-[#022683]/20 outline-none transition-all text-gray-800"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-semibold text-[#022683] mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#022683] focus:ring-2 focus:ring-[#022683]/20 outline-none transition-all text-gray-800"
                      placeholder="Enter your mobile number"
                    />
                  </div>

                  {/* Profile of the Firm */}
                  <div>
                    <label className="block text-sm font-semibold text-[#022683] mb-2">
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
                        className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#022683] cursor-pointer transition-all bg-gray-50 hover:bg-[#022683]/5 group"
                      >
                        <Upload className="h-5 w-5 text-[#888888] group-hover:text-[#022683] transition-colors" />
                        <span className="text-sm text-[#888888] group-hover:text-[#022683] transition-colors">
                          {formData.profile ? formData.profile.name : 'Upload PDF/DOC (max 5MB)'}
                        </span>
                      </label>
                    </div>
                    <p className="text-xs text-[#888888] mt-2">
                      Supported formats: PDF, DOC, DOCX
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#022683] hover:bg-[#011952] text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#022683]/30 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
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

    </div>
  );
}
