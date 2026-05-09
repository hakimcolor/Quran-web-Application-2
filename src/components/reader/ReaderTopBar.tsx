'use client';
import { useParams, useRouter } from 'next/navigation';
import { Search, Moon, Sun, Sunset, Coffee } from 'lucide-react';
import { SURAHS_META } from '@/data/surahs';
import { useSettingsStore, AppTheme } from '@/store/settingsStore';

const THEMES: { value: AppTheme; icon: React.ReactNode; label: string }[] = [
  { value: 'dark', icon: <Moon size={16} />, label: 'Dark' },
  { value: 'light', icon: <Sun size={16} />, label: 'Light' },
  { value: 'gray', icon: <Sunset size={16} />, label: 'Gray' },
  { value: 'sepia', icon: <Coffee size={16} />, label: 'Sepia' },
];

export function ReaderTopBar() {
  const params = useParams();
  const router = useRouter();
  const { appTheme, setAppTheme } = useSettingsStore();

  const surahId = params?.id ? Number(params.id) : null;
  const surah = surahId ? SURAHS_META.find((s) => s.id === surahId) : null;

  /* Cycle to next theme */
  const cycleTheme = () => {
    const idx = THEMES.findIndex((t) => t.value === appTheme);
    setAppTheme(THEMES[(idx + 1) % THEMES.length].value);
  };

  const currentTheme = THEMES.find((t) => t.value === appTheme) ?? THEMES[0];

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background">
      {/* Surah title */}
      <div>
        {surah ? (
          <>
            <p className="text-foreground font-semibold text-sm leading-tight">
              Surah {surah.transliteration}
            </p>
            <p className="text-muted-foreground text-xs">
              Ayah · {surah.total_verses} ·{' '}
              {surah.type === 'meccan' ? 'Makkah' : 'Madinah'}
            </p>
          </>
        ) : (
          <p className="text-foreground font-semibold text-sm">Quran</p>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          onClick={() => router.push('/search')}
          aria-label="Search"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Search size={16} />
        </button>

        {/* Theme cycle */}
        <button
          onClick={cycleTheme}
          aria-label={`Theme: ${currentTheme.label}`}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {currentTheme.icon}
        </button>

        {/* Support Us */}
        <a
          href="/support"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-colors"
        >
          Support Us
          <span className="text-base leading-none">💚</span>
        </a>
      </div>
    </div>
  );
}
