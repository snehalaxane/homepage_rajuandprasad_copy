import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, Image as ImageIcon, Calendar, MapPin } from 'lucide-react';
import { ScrollToTop } from '../components/scroll-to-top';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Gallery data interfaces
interface GalleryIntro {
  heading: string;
  subheading: string;
}

interface GalleryImage {
  _id: string;
  url: string;
  title: string;
  category: string;
  year: string;
  enabled: boolean;
  order: number;
}

interface LightboxProps {
  image: GalleryImage | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function Lightbox({ image, onClose, onNext, onPrev }: LightboxProps) {
  if (!image) return null;

  const imageUrl = image.url.startsWith('http')
    ? image.url
    : `${API_BASE_URL.replace(/\/$/, '')}/${image.url.replace(/^\//, '')}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative z-10 max-w-6xl w-full mx-4"
        >
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors px-0 cursor-pointer"
          >
            <ChevronRight className="h-6 w-6 text-white rotate-180" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors px-0 cursor-pointer"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          <div className="bg-white rounded-2xl overflow-hidden">
            <img
              src={imageUrl}
              alt={image.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />

            <div className="p-6 bg-gradient-to-r from-[var(--primary)]/5 to-blue-50/20">
              <h3 className="text-2xl font-bold text-[var(--primary)] mb-3">
                {image.title}
              </h3>
              <p className="text-[var(--secondary)] mb-4">
                Captured during our {image.category} events.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-[var(--secondary)]">
                  <Calendar className="h-4 w-4" />
                  <span>{image.year}</span>
                </div>
                {/* <div className="flex items-center gap-2 text-[var(--secondary)]">
                  <MapPin className="h-4 w-4" />
                  <span>India</span>
                </div> */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[var(--primary)] text-white text-xs font-semibold rounded-full">
                    {image.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [intro, setIntro] = useState<GalleryIntro>({
    heading: 'Our Gallery',
    subheading: 'A visual journey through our milestones and memories.'
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imagesRes, introRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/gallery`),
          fetch(`${API_BASE_URL}/api/gallery/intro`)
        ]);

        if (imagesRes.ok) {
          const data = await imagesRes.json();
          setGalleryImages(data.filter((img: any) => img.enabled));
        }
        if (introRes.ok) {
          const data = await introRes.json();
          setIntro(data);
        }
      } catch (err) {
        console.error('Error fetching gallery data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = ['All', ...Array.from(new Set(galleryImages.map(img => img.category))).sort()];

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  const handleNext = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img._id === selectedImage._id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img._id === selectedImage._id);
    const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setSelectedImage(filteredImages[prevIndex]);
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
        <section className="pt-25 pb-10  bg-gradient-to-r from-[var(--primary)]/5 to-blue-50/20 border-b border-gray-100">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--secondary)] mb-6">
                <a href="#home" className="hover:text-[var(--primary)] transition-colors">Home</a>
                <ChevronRight className="h-4 w-4" />
                <span className="text-[var(--primary)] font-semibold">Gallery</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-[var(--primary)] mb-6">
                {intro.heading}
              </h1>

              <p className="text-lg lg:text-xl text-[var(--secondary)] leading-relaxed max-w-3xl mx-auto">
                {intro.subheading}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer ${selectedCategory === category
                    ? 'bg-[var(--primary)] text-white shadow-xl scale-105'
                    : 'bg-white text-[var(--secondary)] hover:bg-gray-100 shadow-md hover:shadow-lg border border-gray-200'
                    }`}
                >
                  {category}
                  {category !== 'All' && (
                    <span className="ml-2 opacity-70">
                      ({galleryImages.filter(img => img.category === category).length})
                    </span>
                  )}
                </button>
              ))}
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => {
                const imageUrl = image.url.startsWith('http')
                  ? image.url
                  : `${API_BASE_URL.replace(/\/$/, '')}/${image.url.replace(/^\//, '')}`;

                return (
                  <motion.div
                    key={image._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    onClick={() => setSelectedImage(image)}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { e.currentTarget.src = "https://placehold.co/400?text=Image+Not+Found"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      {/* <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                        {image.title || 'Untitled Image'}
                      </h3> */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--secondary)]">
                          <Calendar className="h-3 w-3" />
                          {image.year}
                        </span>
                        <span className="px-2 py-1 bg-[var(--primary)]/5 text-[var(--primary)] text-xs font-semibold rounded-full">
                          {image.category}
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 border-2 border-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                  </motion.div>
                );
              })}
            </div>

            {filteredImages.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="h-12 w-12 text-[var(--secondary)]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No images found</h3>
                <p className="text-[var(--secondary)] mb-6">Try selecting a different category</p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <div className="grid sm:grid-cols-2 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                <div className="text-center py-4 sm:py-0">
                  <div className="text-4xl font-bold text-[var(--primary)] mb-2">{galleryImages.length}</div>
                  <div className="text-sm text-[var(--secondary)] font-semibold">Total Images</div>
                </div>
                <div className="text-center py-4 sm:py-0">
                  <div className="text-4xl font-bold text-[var(--primary)] mb-2">{categories.length - 1}</div>
                  <div className="text-sm text-[var(--secondary)] font-semibold">Categories</div>
                </div>
                {/* <div className="text-center py-4 sm:py-0">
                  <div className="text-4xl font-bold text-[var(--primary)] mb-2">
                    {Array.from(new Set(galleryImages.map(img => img.year))).length}
                  </div>
                  <div className="text-sm text-[var(--secondary)] font-semibold">Years of Memories</div>
                </div> */}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <ScrollToTop />

      {selectedImage && (
        <Lightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  );
}

