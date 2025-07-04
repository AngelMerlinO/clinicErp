// src/components/ui/Spinner.jsx
import { motion } from 'framer-motion';

export default function Spinner({ size = 24, color = 'text-white' }) {
  return (
    <motion.svg
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={color}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
        fill="none"
      />
      <path
        fill="currentColor"
        className="opacity-75"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </motion.svg>
  );
}
