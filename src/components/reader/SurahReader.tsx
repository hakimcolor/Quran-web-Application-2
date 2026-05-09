'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchSurahWithTranslation } from '@/services/quranApi';
import { ReaderHeader } from './ReaderHeader';
import { AyahCard } from './AyahCard';
import { useQuranStore } from '@/store/quranStore';
import { SURAHS_META } from '@/data/surahs';
import { useRouter } from 'next/navigation';

interface SurahReaderProps {
  surahId: number;
}

export function SurahReader({ surahId }: SurahReaderProps) {
  const router = useRouter();
  const { setCurrentSurah } = useQuranStore();

  const {
    data: surah,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['surah', surahId],
    queryFn: () => fetchSurahWithTranslation(surahId),
    staleTime: 1000 * 60 * 60,
  });

  const meta = SURAHS_META.find((s) => s.id === surahId);
  const prevSurah = surahId > 1 ? SURAHS_META[surahId - 2] : null;
  const nextSurah = surahId < 114 ? SURAHS_META[surahId] : null;

  const navigate = (id: number) => {
    setCurrentSurah(id);
    router.push(`/surah/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
        <Loader2 size={32} className="animate-spin text-green-500" />
        <p className="text-sm">
          Loading {meta?.transliteration ?? `Surah ${surahId}`}...
        </p>
      </div>
    );
  }

  if (isError || !surah) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500 px-6">
        <AlertCircle size={32} className="text-red-500" />
        <p className="text-sm text-center">
          Failed to load surah. Please check your connection and try again.
        </p>
        <p className="text-xs text-gray-600">{String(error)}</p>
      </div>
    );
  }

  return (
    <motion.div
      key={surahId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto"
    >
      <ReaderHeader surah={surah} />

      {/* Verses */}
      <div role="list" aria-label={`Verses of ${surah.transliteration}`}>
        {surah.verses?.map((verse, index) => (
          <AyahCard
            key={verse.id}
            verse={verse}
            surahId={surahId}
            surahName={surah.transliteration}
            index={index}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-8 border-t border-border">
        {prevSurah ? (
          <button
            onClick={() => navigate(prevSurah.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-muted text-foreground transition-all duration-200 text-sm"
            aria-label={`Previous surah: ${prevSurah.transliteration}`}
          >
            <ChevronLeft size={16} />
            <span>{prevSurah.transliteration}</span>
          </button>
        ) : (
          <div />
        )}

        {nextSurah ? (
          <button
            onClick={() => navigate(nextSurah.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-muted text-foreground transition-all duration-200 text-sm"
            aria-label={`Next surah: ${nextSurah.transliteration}`}
          >
            <span>{nextSurah.transliteration}</span>
            <ChevronRight size={16} />
          </button>
        ) : (
          <div />
        )}
      </div>
    </motion.div>
  );
}
