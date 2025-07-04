// src/components/ui/FullscreenLoader.jsx
import { AnimatePresence, motion } from 'framer-motion';

export default function FullscreenLoader({ show = false }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.svg
            aria-label="Cargando"
            width={64}
            height={64}
            viewBox="0 0 24 24"
            className="text-sky-400 drop-shadow-lg"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ ease: 'linear', repeat: Infinity, duration: 1 }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-20"
              fill="none"
            />
            <path
              fill="currentColor"
              className="opacity-90"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
