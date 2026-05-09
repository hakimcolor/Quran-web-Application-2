'use client';
import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { SURAHS_META } from '@/data/surahs';
import { useQuranStore } from '@/store/quranStore';
import { cn } from '@/lib/utils';

interface SurahSidebarProps {
  onSelect?: () => void;
}

type SidebarTab = 'Surah' | 'Juz' | 'Page';

export function SurahSidebar({ onSelect }: SurahSidebarProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SidebarTab>('Surah');
  const router = useRouter();
  const params = useParams();
  const { setCurrentSurah } = useQuranStore();

  const currentId = params?.id ? Number(params.id) : 1;

  const filtered = useMemo(() => {
    if (!query.trim()) return SURAHS_META;
    const q = query.toLowerCase();
    return SURAHS_META.filter(
      (s) =>
        s.transliteration.toLowerCase().includes(q) ||
        s.translation.toLowerCase().includes(q) ||
        s.name.includes(query) ||
        String(s.id).includes(q)
    );
  }, [query]);

  const handleSelect = (id: number) => {
    setCurrentSurah(id);
    router.push(`/surah/${id}`);
    onSelect?.();
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
      className="w-[220px] h-full bg-card border-r border-border flex flex-col"
      aria-label="Surah list"
    >
      {/* Surah / Juz / Page tabs */}
      <div className="flex border-b border-border shrink-0">
        {(['Surah', 'Juz', 'Page'] as SidebarTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              'flex-1 py-2.5 text-xs font-medium transition-colors cursor-pointer',
              activeTab === t
                ? 'text-foreground border-b-2 border-green-500'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b border-border shrink-0">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Surah"
            aria-label="Search surahs"
            className="w-full bg-secondary border border-border rounded-lg pl-7 pr-7 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-green-500/40 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Surah list — native scroll */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="py-1">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-600 text-xs py-8">
              No surahs found
            </p>
          ) : (
            filtered.map((surah) => {
              const active = surah.id === currentId;
              return (
                <button
                  key={surah.id}
                  onClick={() => handleSelect(surah.id)}
                  aria-label={`Surah ${surah.transliteration}`}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all duration-150 cursor-pointer',
                    active
                      ? 'bg-green-500/10 border-l-2 border-green-500'
                      : 'hover:bg-secondary border-l-2 border-transparent'
                  )}
                >
                  {/* Number badge */}
                  <span
                    className={cn(
                      'shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors',
                      active
                        ? 'bg-green-500 text-white'
                        : 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {surah.id}
                  </span>

                  {/* Names */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={cn(
                          'text-xs font-medium truncate',
                          active ? 'text-green-400' : 'text-foreground'
                        )}
                      >
                        {surah.transliteration}
                      </span>
                      <span
                        className="text-sm text-muted-foreground shrink-0"
                        dir="rtl"
                        lang="ar"
                      >
                        {surah.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate block">
                      {surah.translation}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </motion.aside>
  );
}
