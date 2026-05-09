'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ArabicFont, SettingsState } from '@/types';

export type AppTheme = 'dark' | 'light' | 'gray' | 'sepia';

interface SettingsStore extends SettingsState {
  appTheme: AppTheme; // 4-mode theme
  setArabicFont: (font: ArabicFont) => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  toggleTranslation: () => void;
  toggleTransliteration: () => void;
  setAppTheme: (t: AppTheme) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      arabicFont: 'uthmanic',
      arabicFontSize: 28,
      translationFontSize: 15,
      showTranslation: true,
      showTransliteration: false,
      theme: 'dark',
      appTheme: 'dark', // default mood
      setArabicFont: (font) => set({ arabicFont: font }),
      setArabicFontSize: (size) => set({ arabicFontSize: size }),
      setTranslationFontSize: (size) => set({ translationFontSize: size }),
      toggleTranslation: () =>
        set((s) => ({ showTranslation: !s.showTranslation })),
      toggleTransliteration: () =>
        set((s) => ({ showTransliteration: !s.showTransliteration })),
      setAppTheme: (t) => set({ appTheme: t }),
    }),
    { name: 'quran-settings' }
  )
);
