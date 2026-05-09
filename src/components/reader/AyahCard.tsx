'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  Loader2,
  MoreHorizontal,
} from 'lucide-react';
import { Verse } from '@/types';
import { useQuranStore } from '@/store/quranStore';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AyahCardProps {
  verse: Verse;
  surahId: number;
  surahName: string;
  index: number;
}

const FONT_FAMILY_MAP = {
  uthmanic: "'Noto Naskh Arabic', serif",
  amiri: "'Amiri', serif",
  scheherazade: "'Scheherazade New', serif",
};

/* Format seconds to m:ss */
function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + sec.toString().padStart(2, '0');
}

export const AyahCard = memo(function AyahCard({
  verse,
  surahId,
  surahName,
  index,
}: AyahCardProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useQuranStore();
  const {
    playVerse,
    isVersePlaying,
    isVerseActive,
    isLoading,
    duration,
    currentTime,
  } = useAudioPlayer();
  const { arabicFont, arabicFontSize, translationFontSize, showTranslation } =
    useSettingsStore();

  const bookmarked = isBookmarked(surahId, verse.id);
  const playing = isVersePlaying(surahId, verse.id);
  const active = isVerseActive(surahId, verse.id);
  const loading = active && isLoading;

  /* Toggle bookmark with toast */
  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(surahId, verse.id);
      toast('Bookmark removed', { icon: '🗑️' });
    } else {
      addBookmark({
        surahId,
        verseId: verse.id,
        surahName,
        verseText: verse.text,
        addedAt: Date.now(),
      });
      toast('Bookmarked!', { icon: '🔖' });
    }
  };

  const handlePlay = () => playVerse(surahId, verse.id, verse.verse_number);

  return (
    <motion.article
      id={'verse-' + verse.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.4) }}
      className={cn(
        'group relative flex gap-3 px-4 py-5 border-b border-border transition-all duration-200',
        active
          ? 'bg-green-500/5 border-l-2 border-l-green-500'
          : 'hover:bg-secondary/40'
      )}
      aria-label={'Verse ' + verse.verse_number}
    >
      {/* Left: verse number + action icons */}
      <div className="flex flex-col items-center gap-2 shrink-0 pt-1">
        <div
          className="verse-number"
          aria-label={'Verse ' + verse.verse_number}
        >
          {verse.verse_number}
        </div>

        {/* Icons visible on hover or when active */}
        <div
          className={cn(
            'flex flex-col items-center gap-1.5 transition-opacity duration-200',
            active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          <button
            onClick={handlePlay}
            aria-label={playing ? 'Pause' : 'Play'}
            className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
              active
                ? 'bg-green-500/20 text-green-400'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            )}
          >
            {loading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : playing ? (
              <Pause size={13} />
            ) : (
              <Play size={13} />
            )}
          </button>

          <button
            onClick={handleBookmark}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
            className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
              bookmarked
                ? 'bg-green-500/20 text-green-400'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            )}
          >
            {bookmarked ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
          </button>

          <button
            aria-label="More"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <MoreHorizontal size={13} />
          </button>
        </div>

        {/* Duration when playing */}
        {active && duration > 0 && (
          <span className="text-[9px] text-muted-foreground tabular-nums text-center leading-tight">
            {fmtTime(currentTime)}
            <br />
            {fmtTime(duration)}
          </span>
        )}
      </div>

      {/* Right: Arabic text + translation */}
      <div className="flex-1 min-w-0">
        <p
          className="arabic-text text-right text-foreground leading-loose mb-4 select-text"
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: FONT_FAMILY_MAP[arabicFont],
            fontSize: arabicFontSize + 'px',
            lineHeight: arabicFontSize > 30 ? '2.4' : '2.2',
          }}
        >
          {verse.text}
        </p>

        {showTranslation && verse.translation && (
          <>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5 font-medium">
              Saheeh International
            </p>
            <p
              className="text-foreground/80 leading-relaxed select-text"
              style={{ fontSize: translationFontSize + 'px' }}
            >
              {verse.translation}
            </p>
          </>
        )}
      </div>
    </motion.article>
  );
});
