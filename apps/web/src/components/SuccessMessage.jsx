import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const SuccessMessage = ({ message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
    >
      <div className="bg-primary text-primary-foreground rounded-xl shadow-lg p-4 flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
        <p className="font-medium flex-1">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            ×
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SuccessMessage;