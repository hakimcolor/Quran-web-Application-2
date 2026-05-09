'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookmarkItem } from '@/types';

interface QuranStore {
  currentSurahId: number;
  currentVerseId: number | null;
  bookmarks: BookmarkItem[];
  setCurrentSurah: (id: number) => void;
  setCurrentVerse: (id: number | null) => void;
  addBookmark: (item: BookmarkItem) => void;
  removeBookmark: (surahId: number, verseId: number) => void;
  isBookmarked: (surahId: number, verseId: number) => boolean;
}

export const useQuranStore = create<QuranStore>()(
  persist(
    (set, get) => ({
      currentSurahId: 1,
      currentVerseId: null,
      bookmarks: [],
      setCurrentSurah: (id) =>
        set({ currentSurahId: id, currentVerseId: null }),
      setCurrentVerse: (id) => set({ currentVerseId: id }),
      addBookmark: (item) =>
        set((s) => ({
          bookmarks: s.bookmarks.some(
            (b) => b.surahId === item.surahId && b.verseId === item.verseId
          )
            ? s.bookmarks
            : [...s.bookmarks, item],
        })),
      removeBookmark: (surahId, verseId) =>
        set((s) => ({
          bookmarks: s.bookmarks.filter(
            (b) => !(b.surahId === surahId && b.verseId === verseId)
          ),
        })),
      isBookmarked: (surahId, verseId) =>
        get().bookmarks.some(
          (b) => b.surahId === surahId && b.verseId === verseId
        ),
    }),
    { name: 'quran-state' }
  )
);
