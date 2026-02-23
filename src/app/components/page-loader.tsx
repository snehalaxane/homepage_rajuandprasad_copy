import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center"
        >
          <div className="text-center">
            {/* Logo animation */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-5xl font-bold text-white mb-2">Raju & Prasad</h1>
              <p className="text-blue-100 text-lg">Chartered Accountants</p>
            </motion.div>

            {/* Loading animation */}
            <div className="flex gap-2 justify-center">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{
                    y: [0, -20, 0],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-8 w-64 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
