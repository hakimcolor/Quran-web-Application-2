'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Type } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { ArabicFont } from '@/types';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

type Tab = 'translation' | 'reading';

const FONT_OPTIONS: { value: ArabicFont; label: string }[] = [
  { value: 'uthmanic', label: 'KFGQPC' },
  { value: 'amiri', label: 'Amiri' },
  { value: 'scheherazade', label: 'Scheherazade' },
];

export function RightPanel() {
  const [tab, setTab] = useState<Tab>('translation');
  const [fontOpen, setFontOpen] = useState(true);
  const [readingOpen, setReadingOpen] = useState(false);

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
    <aside
      className="w-[280px] h-full bg-card border-l border-border flex flex-col"
      aria-label="Reading settings"
    >
      {/* Tabs */}
      <div className="flex border-b border-border shrink-0">
        {(['translation', 'reading'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-3 text-xs font-semibold capitalize transition-colors',
              tab === t
                ? 'text-foreground border-b-2 border-green-500'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'translation' && (
          <div className="p-4 space-y-1">
            {/* Reading Settings accordion */}
            <button
              onClick={() => setReadingOpen((v) => !v)}
              className="w-full flex items-center justify-between py-2.5 text-sm text-foreground hover:text-foreground/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Type size={14} className="text-muted-foreground" />
                <span>Reading Settings</span>
              </div>
              {readingOpen ? (
                <ChevronUp size={14} className="text-muted-foreground" />
              ) : (
                <ChevronDown size={14} className="text-muted-foreground" />
              )}
            </button>

            {readingOpen && (
              <div className="pb-2 space-y-3 pl-1">
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
            )}

            <div className="border-t border-border my-1" />

            {/* Font Settings accordion */}
            <button
              onClick={() => setFontOpen((v) => !v)}
              className="w-full flex items-center justify-between py-2.5 text-sm text-green-500 hover:text-green-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Type size={14} className="text-green-500" />
                <span>Font Settings</span>
              </div>
              {fontOpen ? (
                <ChevronUp size={14} className="text-muted-foreground" />
              ) : (
                <ChevronDown size={14} className="text-muted-foreground" />
              )}
            </button>

            {fontOpen && (
              <div className="space-y-5 pb-2 pl-1">
                {/* Arabic Font Size */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      Arabic Font Size
                    </span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded tabular-nums">
                      {arabicFontSize}
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
                </div>

                {/* Translation Font Size */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      Translation Font Size
                    </span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded tabular-nums">
                      {translationFontSize}
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
                </div>

                {/* Arabic Font Face */}
                <div>
                  <span className="text-xs text-muted-foreground block mb-2">
                    Arabic Font Face
                  </span>
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground hover:border-muted-foreground/30 transition-colors"
                    onClick={() => {
                      const idx = FONT_OPTIONS.findIndex(
                        (f) => f.value === arabicFont
                      );
                      setArabicFont(
                        FONT_OPTIONS[(idx + 1) % FONT_OPTIONS.length].value
                      );
                    }}
                    aria-label="Change Arabic font"
                  >
                    <span>
                      {FONT_OPTIONS.find((f) => f.value === arabicFont)
                        ?.label ?? 'KFGQPC'}
                    </span>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'reading' && (
          <div className="p-4 space-y-2">
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
        )}
      </div>

      {/* Support Us */}
      <div className="p-4 border-t border-border shrink-0">
        <p className="text-xs font-semibold text-foreground mb-1">
          Help spread the knowledge of Islam
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          Your regular support helps us reach our religious brothers and sisters
          with the message of Islam. Join our mission and be part of the big
          change.
        </p>
        <a
          href="/support"
          className="block w-full text-center py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
        >
          Support Us
        </a>
      </div>
    </aside>
  );
}

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
      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-secondary border border-border hover:border-muted-foreground/30 transition-colors"
    >
      <span className="text-sm text-foreground">{label}</span>
      <div
        className={cn(
          'w-9 h-5 rounded-full transition-colors duration-200 relative',
          enabled ? 'bg-green-500' : 'bg-muted'
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
