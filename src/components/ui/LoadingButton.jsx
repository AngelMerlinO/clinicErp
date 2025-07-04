import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingButton({ isLoading, children, className = '', ...props }) {
  return (
    <button
      disabled={isLoading}
      className={`relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium
        transition-all duration-300 ease-in-out
        ${isLoading ? 'bg-opacity-60 cursor-wait' : 'hover:shadow-lg'}
        ${className}`}
      {...props}
    >
      {/* Spinner */}
      {isLoading && (
        <motion.div
          className="absolute left-4 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <motion.div
            className="h-4 w-4 border-[3px] border-sky-300 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
          />
        </motion.div>
      )}

      {/* Label */}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>{children}</span>
    </button>
  );
}
