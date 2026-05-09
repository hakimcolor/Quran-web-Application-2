'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SurahSidebar } from '@/components/sidebar/SurahSidebar';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 z-50 flex"
            role="dialog"
            aria-modal="true"
            aria-label="Surah navigation"
          >
            <div className="relative flex h-full">
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="absolute top-3 right-3 z-10 w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={15} />
              </button>
              <SurahSidebar onSelect={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
