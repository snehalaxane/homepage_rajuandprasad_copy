import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, FileText, Clock } from 'lucide-react';
import { ScrollToTop } from '../components/scroll-to-top';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface LegalPageData {
    _id: string;
    pageTitle: string;
    pageSlug: string;
    content: string;
    lastUpdated: string;
}

interface LegalPageProps {
    slug: string;
}

export function LegalPage({ slug }: LegalPageProps) {
    const [pageData, setPageData] = useState<LegalPageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            setError(false);
            try {
                // Slugs in CMS are like "/terms-and-conditions"
                // The slug from hash might be "terms-and-conditions"
                const searchSlug = slug.startsWith('/') ? slug : `/${slug}`;

                const response = await axios.get(`${API_BASE_URL}/api/legal`);
                const pages = response.data;
                const page = pages.find((p: any) => p.pageSlug === searchSlug && p.status === 'published');

                if (page) {
                    setPageData(page);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Error fetching legal page:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#022683] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[#022683] font-semibold">Loading page content...</p>
                </div>
            </div>
        );
    }

    if (error || !pageData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
                <div className="text-center px-6">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[#022683]">Page Not Found</h2>
                    <p className="text-[#888888] mt-2">The legal page you are looking for does not exist or is not published.</p>
                    <button
                        onClick={() => window.location.hash = '#home'}
                        className="mt-6 px-6 py-2 bg-[#022683] text-white rounded-lg hover:bg-[#011952] transition-colors"
                    >
                        Go Back Home
                    </button>
                </div>
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
                                <span className="text-[#022683] font-semibold">{pageData.pageTitle}</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl lg:text-5xl font-bold text-[#022683] mb-6 leading-tight">
                                {pageData.pageTitle}
                            </h1>

                            {/* Meta */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-[#888888]">
                                    <Clock className="h-5 w-5 text-[#022683]" />
                                    <span className="font-medium text-sm">Last updated: {pageData.lastUpdated}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-12"
                        >
                            <div
                                className="prose prose-lg max-w-none text-gray-700 leading-relaxed
                  prose-headings:text-[#022683] prose-headings:font-bold
                  prose-p:mb-6 prose-strong:text-gray-900
                  prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2
                  prose-a:text-[#022683] prose-a:font-semibold hover:prose-a:underline"
                                dangerouslySetInnerHTML={{ __html: pageData.content }}
                            />
                        </motion.div>
                    </div>
                </section>
            </main>
            <ScrollToTop />
        </>
    );
}
