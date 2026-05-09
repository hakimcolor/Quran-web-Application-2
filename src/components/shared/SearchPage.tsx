'use client';
import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, BookOpen } from 'lucide-react';

import { SURAHS_META } from '@/data/surahs';
import { SearchResult } from '@/types';
import { SearchBar } from './SearchBar';
import { highlightText } from '@/lib/utils';
import { useQuranStore } from '@/store/quranStore';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { setCurrentSurah } = useQuranStore();

  /* Quick surah name suggestions while typing */
  const matchingSurahs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SURAHS_META.filter(
      (s) =>
        s.transliteration.toLowerCase().includes(q) ||
        s.translation.toLowerCase().includes(q) ||
        s.name.includes(query.trim())
    ).slice(0, 6);
  }, [query]);

  const handleSearch = useCallback(async () => {
    const q = query.trim();
    if (!q) return;

    setIsSearching(true);
    setSearchedQuery(q);
    setResults([]);
    setProgress(0);

    try {
      // small delay so progress bar appears
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 5, 90));
      }, 200);

      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      clearInterval(interval);
      setProgress(100);

      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const navigateToVerse = (surahId: number) => {
    setCurrentSurah(surahId);
    router.push(`/surah/${surahId}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Search Quran
        </h1>
        <p className="text-muted-foreground text-sm">
          Search by Arabic text or English translation across all 114 surahs
        </p>
      </motion.div>

      {/* Search input */}
      <div className="flex gap-3 mb-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search Arabic or English..."
          className="flex-1"
        />
        <button
          onClick={handleSearch}
          disabled={!query.trim() || isSearching}
          aria-label="Search"
          className="px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          {isSearching ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
          Search
        </button>
      </div>

      {/* Surah name suggestions */}
      {matchingSurahs.length > 0 && !searchedQuery && (
        <div className="mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            Surahs
          </p>
          <div className="flex flex-wrap gap-2">
            {matchingSurahs.map((s) => (
              <button
                key={s.id}
                onClick={() => navigateToVerse(s.id)}
                className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-muted text-foreground text-sm transition-colors border border-border"
              >
                {s.transliteration}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading with progress */}
      {isSearching && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
          <Loader2 size={24} className="animate-spin text-green-500" />
          <span className="text-sm">
            Searching all 114 surahs... {progress}%
          </span>
          <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {!isSearching && searchedQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-xs text-muted-foreground mb-4">
              {results.length === 0
                ? `No results for "${searchedQuery}"`
                : `${results.length} result${results.length !== 1 ? 's' : ''} for "${searchedQuery}"`}
            </p>

            <div className="space-y-3">
              {results.map((result, i) => (
                <motion.button
                  key={`${result.surahId}-${result.verseNumber}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  onClick={() => navigateToVerse(result.surahId)}
                  className="w-full text-left p-4 rounded-xl bg-card border border-border hover:border-green-500/30 hover:bg-secondary/50 transition-all duration-200"
                  aria-label={`Go to ${result.surahTransliteration} verse ${result.verseNumber}`}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={13} className="text-green-500" />
                    <span className="text-xs text-green-400 font-medium">
                      {result.surahTransliteration}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      Verse {result.verseNumber}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {result.verseKey}
                    </span>
                  </div>

                  {/* Arabic */}
                  <p
                    className="text-right text-foreground text-xl leading-loose mb-2"
                    dir="rtl"
                    lang="ar"
                    style={{
                      fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: highlightText(result.arabicText, searchedQuery),
                    }}
                  />

                  {/* Translation */}
                  <p
                    className="text-muted-foreground text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(result.translation, searchedQuery),
                    }}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!isSearching && !searchedQuery && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Search size={40} className="mb-4 opacity-30" />
          <p className="text-sm">Enter a word or phrase to search</p>
          <p className="text-xs mt-1 opacity-60">
            Supports Arabic and English · All 114 surahs
          </p>
        </div>
      )}
    </div>
  );
}
