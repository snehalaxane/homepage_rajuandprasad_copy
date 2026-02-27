import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, ArrowRight, Calendar, Tag, ChevronLeft, ArrowLeft } from 'lucide-react';
import { ScrollToTop } from '../components/scroll-to-top';
import { Button } from '../components/ui/button';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const resolveImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

interface BlogIntro {
  title: string;
  subtitle: string;
}

interface BlogPost {
  _id: string;
  title: string;
  shortDescription: string;
  publishDate: string;
  category: string;
  tags: string[];
  content: string;
  featuredImage: string;
  enabled: boolean;
  author: string;
}

const thinkTankLinks = [
  { label: 'Newsletter', href: '#newsletter', icon: '📰' },
  { label: 'Our Blog', href: '#blog', icon: '📝' },
  { label: 'Alumni', href: '#alumni', icon: '🎓' },
];

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [intro, setIntro] = useState<BlogIntro | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 4;

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('blog/')) {
        setSelectedPostId(hash.split('/')[1]);
      } else {
        setSelectedPostId(null);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [introRes, postsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/blog-intro`),
          fetch(`${API_BASE_URL}/api/blogs`)
        ]);

        if (introRes.ok) setIntro(await introRes.json());
        if (postsRes.ok) {
          const data = await postsRes.json();
          setPosts(data.filter((p: BlogPost) => p.enabled));
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(posts.map(post => post.category)))];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const selectedPost = posts.find(p => p._id === selectedPostId);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--primary)] font-semibold">Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <>

      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
        {/* Page Header */}
        <section className="pt-25 pb-10  bg-gradient-to-r from-[var(--primary)]/5 to-blue-50/20 border-b border-gray-100">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-[var(--secondary)] mb-4">
                <a href="#home" className="hover:text-[var(--primary)] transition-colors">Home</a>
                <ChevronRight className="h-4 w-4" />
                <span className="hover:text-[var(--primary)] transition-colors cursor-pointer">Think Tank</span>
                <ChevronRight className="h-4 w-4" />
                {selectedPost ? (
                  <>
                    <a href="#blog" className="hover:text-[var(--primary)] transition-colors">Our Blog</a>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-[var(--primary)] font-semibold line-clamp-1">{selectedPost.title}</span>
                  </>
                ) : (
                  <span className="text-[var(--primary)] font-semibold">Our Blog</span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-6xl font-bold text-[var(--primary)] mb-6 leading-tight">
                {selectedPost ? selectedPost.title : (intro?.title || 'Our Blog')}
              </h1>

              {/* Subtitle / Meta */}
              {selectedPost ? (
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-[var(--secondary)]">
                    <Calendar className="h-5 w-5 text-[var(--primary)]" />
                    <span className="font-medium">
                      {new Date(selectedPost.publishDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {selectedPost.author && (
                    <div className="flex items-center gap-2 text-[var(--secondary)]">
                      <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold uppercase">
                        {selectedPost.author.charAt(0)}
                      </div>
                      <span className="font-medium"> {selectedPost.author}</span>
                    </div>
                  )}
                  <span className="px-4 py-1.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-full shadow-lg shadow-[var(--primary)]/20">
                    {selectedPost.category}
                  </span>
                </div>
              ) : (
                <p className="text-lg lg:text-xl text-[var(--secondary)] leading-relaxed max-w-2xl">
                  {intro?.subtitle || 'Insights, updates and articles on tax, audit and regulatory changes.'}
                </p>
              )}
            </motion.div>
          </div>
        </section>

        {/* Blog Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Side - Blog Posts */}
              <div className="lg:col-span-2">
                {/* Blog Posts List or Detail */}
                <AnimatePresence mode="wait">
                  {selectedPost ? (
                    <motion.div
                      key="blog-detail"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-8"
                    >
                      {/* Back Button */}
                      <button
                        onClick={() => window.location.hash = '#blog'}
                        className="flex items-center gap-2 text-[var(--primary)] font-bold hover:gap-3 transition-all group mb-4"
                      >
                        <ArrowLeft className="h-5 w-5" />
                        Back to All Blogs
                      </button>

                      {/* Featured Image */}
                      {selectedPost.featuredImage && (
                        <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-[#f5f6fa] flex items-center justify-center">
                          <img
                            src={resolveImageUrl(selectedPost.featuredImage)}
                            alt={selectedPost.title}
                            className="object-contain max-h-[400px] max-w-full mx-auto"
                          />
                        </div>
                      )}

                      {/* Post Content */}
                      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-12">
                        <div
                          className="prose prose-lg max-w-none text-gray-700 leading-relaxed
                            prose-headings:text-[var(--primary)] prose-headings:font-bold
                            prose-p:mb-6 prose-strong:text-gray-900
                            prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2"
                          dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                        />

                        {/* Tags */}
                        {selectedPost.tags.length > 0 && (
                          <div className="mt-12 pt-8 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedPost.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-4 py-2 bg-gray-50 text-[var(--secondary)] text-sm font-semibold rounded-xl border border-gray-100 hover:bg-[var(--primary)]/5 hover:text-[var(--primary)] transition-all cursor-default"
                                >
                                  <Tag className="h-4 w-4" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="blog-list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Search and Filter */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Search */}
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--secondary)]" />
                            <input
                              type="text"
                              placeholder="Search articles..."
                              value={searchQuery}
                              onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                              }}
                              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--primary)] focus:outline-none transition-all text-gray-900"
                            />
                          </div>

                          {/* Category Filter */}
                          <select
                            value={selectedCategory}
                            onChange={(e) => {
                              setSelectedCategory(e.target.value);
                              setCurrentPage(1);
                            }}
                            className="px-6 py-3 rounded-xl border-2 border-gray-200 focus:border-[var(--primary)] focus:outline-none transition-all text-gray-900 font-semibold bg-white cursor-pointer"
                          >
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                      </motion.div>

                      {currentPosts.map((post, index) => (
                        <motion.article
                          key={post._id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ y: -8, transition: { duration: 0.3 } }}
                          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all group"
                        >
                          {post.featuredImage && (
                            <div className="relative h-64 overflow-hidden bg-[#f5f6fa] flex items-center justify-center">
                              <img
                                src={resolveImageUrl(post.featuredImage)}
                                alt={post.title}
                                className="object-contain max-h-64 max-w-full mx-auto transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="p-8">
                            {/* Date Pill */}
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)]/5 rounded-full">
                                <Calendar className="h-4 w-4 text-[var(--primary)]" />
                                <span className="text-sm font-semibold text-[var(--primary)]">
                                  {new Date(post.publishDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              {post.author && (
                                <span className="text-sm text-[var(--secondary)]">By {post.author}</span>
                              )}
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[var(--primary)] transition-colors">
                              {post.title}
                            </h2>

                            {/* Excerpt */}
                            <p className="text-[var(--secondary)] leading-relaxed mb-6 line-clamp-2">
                              {post.shortDescription}
                            </p>

                            {/* Tags and CTA */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              {/* Tags */}
                              <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-[var(--secondary)] text-xs font-semibold rounded-full hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all"
                                  >
                                    <Tag className="h-3 w-3" />
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* Read More Button */}
                              <Button
                                variant="outline"
                                className="border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white group/btn transition-all"
                                asChild
                              >
                                <a href={`#blog/${post._id}`}>
                                  Read More
                                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </motion.article>
                      ))}

                      {/* Pagination (Inside List View) */}
                      {totalPages > 1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="flex items-center justify-center gap-2 mt-12"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="border-2 border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                          </Button>

                          {[...Array(totalPages)].map((_, i) => (
                            <Button
                              key={i + 1}
                              variant={currentPage === i + 1 ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCurrentPage(i + 1)}
                              className={
                                currentPage === i + 1
                                  ? 'bg-[var(--primary)] hover:bg-[#011952] text-white px-4 py-2'
                                  : 'border-2 border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white px-4 py-2'
                              }
                            >
                              {i + 1}
                            </Button>
                          ))}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="border-2 border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
                          >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Sidebar - Think Tank Links */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="sticky top-24"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Sidebar Header */}
                    <div className="bg-gradient-to-r from-[var(--primary)] to-[#033aa8] px-6 py-6">
                      <h3 className="text-xl font-bold text-white">Think Tank Links</h3>
                    </div>

                    {/* Links */}
                    <div className="p-4">
                      {thinkTankLinks.map((link, index) => {
                        const isActive =
                          (link.href === '#newsletter' && window.location.hash === '#newsletter') ||
                          (link.href === '#blog' && window.location.hash === '#blog') ||
                          (link.href === '#alumni' && window.location.hash === '#alumni');

                        return (
                          <motion.a
                            key={link.label}
                            href={link.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                            className={`flex items-center gap-3 px-4 py-4 rounded-xl mb-2 transition-all group ${isActive
                              ? 'bg-[var(--primary)] text-white shadow-lg'
                              : 'hover:bg-[var(--primary)]/5 text-gray-900 hover:text-[var(--primary)]'
                              }`}
                          >
                            <span className="text-2xl">{link.icon}</span>
                            <span className="font-semibold text-base">{link.label}</span>
                            <ArrowRight className={`ml-auto h-4 w-4 transition-transform ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                              }`} />
                          </motion.a>
                        );
                      })}
                    </div>

                    {/* Additional Info */}
                    <div className="px-6 py-6 bg-gradient-to-br from-gray-50 to-blue-50/20 border-t border-gray-100">
                      <p className="text-sm text-[var(--secondary)] leading-relaxed">
                        Stay updated with our latest insights on tax, audit, and regulatory changes. Subscribe to our newsletter for regular updates.
                      </p>
                      <Button
                        size="sm"
                        className="mt-4 w-full bg-[var(--primary)] hover:bg-[#011952] text-white"
                        asChild
                      >
                        <a href="#newsletter">
                          Subscribe Now
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
      <ScrollToTop />
    </>
  );
}

