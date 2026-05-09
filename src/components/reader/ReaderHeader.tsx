'use client';
import { motion } from 'framer-motion';
import { Surah } from '@/types';

interface ReaderHeaderProps {
  surah: Surah;
}

export function ReaderHeader({ surah }: ReaderHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center py-8 px-6 border-b border-border"
    >
      {/* Decorative icon */}
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
        <span
          className="text-2xl text-foreground"
          dir="rtl"
          lang="ar"
          style={{ fontFamily: "'Scheherazade New', serif" }}
        >
          {surah.name.charAt(0)}
        </span>
      </div>

      {/* Surah name */}
      <h1 className="text-foreground font-bold text-2xl mb-1">
        Surah {surah.transliteration}
      </h1>

      {/* Meta */}
      <p className="text-muted-foreground text-sm">
        Ayah · {surah.total_verses} ·{' '}
        {surah.type === 'meccan' ? 'Makkah' : 'Madinah'}
      </p>

      {/* Bismillah — all surahs except 1 and 9 */}
      {surah.id !== 1 && surah.id !== 9 && (
        <div className="mt-6 pt-5 border-t border-border">
          <p
            className="text-foreground leading-loose text-2xl"
            dir="rtl"
            lang="ar"
            style={{ fontFamily: "'Scheherazade New', serif" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
        </div>
      )}
    </motion.div>
  );
}
