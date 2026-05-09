'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Type, Eye } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { ArabicFont } from '@/types';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

const FONTS: { value: ArabicFont; label: string; preview: string }[] = [
  { value: 'uthmanic', label: 'Noto Naskh', preview: 'بِسْمِ اللَّهِ' },
  { value: 'amiri', label: 'Amiri', preview: 'بِسْمِ اللَّهِ' },
  { value: 'scheherazade', label: 'Scheherazade', preview: 'بِسْمِ اللَّهِ' },
];

const FONT_FAMILY_MAP: Record<ArabicFont, string> = {
  uthmanic: "'Noto Naskh Arabic', serif",
  amiri: "'Amiri', serif",
  scheherazade: "'Scheherazade New', serif",
};

type Tab = 'translation' | 'reading';

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [tab, setTab] = useState<Tab>('translation');
  const {
    arabicFont,
    arabicFontSize,
    translationFontSize,
    showTranslation,
    showTransliteration,
    setArabicFont,
    setArabicFontSize,
    setTranslationFontSize,
    toggleTranslation,
    toggleTransliteration,
  } = useSettingsStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[300px] bg-[var(--sidebar-bg)] border-l border-[var(--border)] z-50 flex flex-col"
            aria-label="Settings panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-[var(--foreground)] font-semibold text-sm">
                Settings
              </h2>
              <button
                onClick={onClose}
                aria-label="Close settings"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-black/5 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Tabs: Translation | Reading */}
            <div className="flex border-b border-[var(--border)]">
              {(['translation', 'reading'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    'flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                    tab === t
                      ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              {tab === 'translation' && (
                <>
                  {/* Arabic Font picker */}
                  <section aria-labelledby="font-section">
                    <div className="flex items-center gap-2 mb-3">
                      <Type size={14} className="text-[var(--primary)]" />
                      <h3
                        id="font-section"
                        className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider"
                      >
                        Arabic Font
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {FONTS.map((font) => (
                        <button
                          key={font.value}
                          onClick={() => setArabicFont(font.value)}
                          aria-pressed={arabicFont === font.value}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all text-left',
                            arabicFont === font.value
                              ? 'border-[var(--primary)]/40 bg-[var(--primary)]/10'
                              : 'border-[var(--border)] bg-[var(--secondary)] hover:border-[var(--muted-foreground)]/30'
                          )}
                        >
                          <span
                            className={cn(
                              'text-xs font-medium',
                              arabicFont === font.value
                                ? 'text-[var(--primary)]'
                                : 'text-[var(--muted-foreground)]'
                            )}
                          >
                            {font.label}
                          </span>
                          <span
                            className="text-base text-[var(--foreground)]"
                            dir="rtl"
                            lang="ar"
                            style={{ fontFamily: FONT_FAMILY_MAP[font.value] }}
                          >
                            {font.preview}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <Separator className="bg-[var(--border)]" />

                  {/* Arabic font size */}
                  <section aria-labelledby="arabic-size">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Type size={14} className="text-[var(--primary)]" />
                        <h3
                          id="arabic-size"
                          className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider"
                        >
                          Arabic Size
                        </h3>
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)] bg-[var(--secondary)] px-2 py-0.5 rounded">
                        {arabicFontSize}px
                      </span>
                    </div>
                    <Slider
                      min={20}
                      max={48}
                      step={2}
                      value={arabicFontSize}
                      onValueChange={(v) => setArabicFontSize(v)}
                      aria-label="Arabic font size"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        Small
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        Large
                      </span>
                    </div>
                  </section>

                  <Separator className="bg-[var(--border)]" />

                  {/* Translation font size */}
                  <section aria-labelledby="trans-size">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Type size={14} className="text-[var(--primary)]" />
                        <h3
                          id="trans-size"
                          className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider"
                        >
                          Translation Size
                        </h3>
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)] bg-[var(--secondary)] px-2 py-0.5 rounded">
                        {translationFontSize}px
                      </span>
                    </div>
                    <Slider
                      min={12}
                      max={22}
                      step={1}
                      value={translationFontSize}
                      onValueChange={(v) => setTranslationFontSize(v)}
                      aria-label="Translation font size"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        Small
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        Large
                      </span>
                    </div>
                  </section>
                </>
              )}

              {tab === 'reading' && (
                <>
                  {/* Display toggles */}
                  <section aria-labelledby="display-section">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye size={14} className="text-[var(--primary)]" />
                      <h3
                        id="display-section"
                        className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider"
                      >
                        Display
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <ToggleRow
                        label="Show Translation"
                        enabled={showTranslation}
                        onToggle={toggleTranslation}
                      />
                      <ToggleRow
                        label="Show Transliteration"
                        enabled={showTransliteration}
                        onToggle={toggleTransliteration}
                      />
                    </div>
                  </section>
                </>
              )}
            </div>

            {/* Support Us section */}
            <div className="px-5 py-4 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-3">
                Help spread the knowledge of Islam. Your regular support helps
                us reach our religious brothers and sisters with the message of
                Islam. Join our mission and be part of the big change.
              </p>
              <a
                href="/support"
                className="block w-full text-center py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Support Us
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* Reusable toggle row */
function ToggleRow({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={enabled}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-[var(--secondary)] border border-[var(--border)] hover:border-[var(--muted-foreground)]/30 transition-colors"
    >
      <span className="text-sm text-[var(--foreground)]">{label}</span>
      <div
        className={cn(
          'w-9 h-5 rounded-full transition-colors duration-200 relative',
          enabled ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
        )}
      >
        <div
          className={cn(
            'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
            enabled ? 'translate-x-4' : 'translate-x-0.5'
          )}
        />
      </div>
    </button>
  );
}
