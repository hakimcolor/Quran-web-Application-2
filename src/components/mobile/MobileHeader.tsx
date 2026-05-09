'use client';
import {
  Menu,
  Settings,
  Search,
  Sun,
  Moon,
  Sunset,
  Coffee,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { SURAHS_META } from '@/data/surahs';
import { useSettingsStore, AppTheme } from '@/store/settingsStore';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  onMenuOpen: () => void;
  onSettingsToggle: () => void;
}

/* Theme cycle order */
const THEMES: { value: AppTheme; icon: React.ReactNode; label: string }[] = [
  { value: 'dark', icon: <Moon size={15} />, label: 'Dark' },
  { value: 'light', icon: <Sun size={15} />, label: 'Light' },
  { value: 'gray', icon: <Sunset size={15} />, label: 'Gray' },
  { value: 'sepia', icon: <Coffee size={15} />, label: 'Sepia' },
];

export function MobileHeader({
  onMenuOpen,
  onSettingsToggle,
}: MobileHeaderProps) {
  const params = useParams();
  const router = useRouter();
  const surahId = params?.id ? Number(params.id) : null;
  const surah = surahId ? SURAHS_META.find((s) => s.id === surahId) : null;
  const { appTheme, setAppTheme } = useSettingsStore();

  /* Cycle to next theme */
  const cycleTheme = () => {
    const idx = THEMES.findIndex((t) => t.value === appTheme);
    setAppTheme(THEMES[(idx + 1) % THEMES.length].value);
  };

  const currentTheme = THEMES.find((t) => t.value === appTheme) ?? THEMES[0];

  return (
    <header className="flex items-center justify-between px-3 py-2 bg-card border-b border-border gap-2">
      {/* Menu */}
      <button
        onClick={onMenuOpen}
        aria-label="Open menu"
        className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Surah title */}
      <div className="flex-1 text-center">
        {surah ? (
          <>
            <p className="text-foreground text-sm font-semibold leading-tight">
              {surah.transliteration}
            </p>
            <p className="text-muted-foreground text-xs">
              {surah.total_verses} verses
            </p>
          </>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">ق</span>
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <button
          onClick={() => router.push('/search')}
          aria-label="Search"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Search size={17} />
        </button>

        {/* Theme cycle */}
        <button
          onClick={cycleTheme}
          aria-label={`Switch theme, current: ${currentTheme.label}`}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {currentTheme.icon}
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsToggle}
          aria-label="Settings"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
}
