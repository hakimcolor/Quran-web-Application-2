export interface Surah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'meccan' | 'medinan';
  total_verses: number;
  verses?: Verse[];
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  text: string;
  translation: string;
  transliteration?: string;
  audio_url?: string;
  bookmarked?: boolean;
}

export interface AudioState {
  isPlaying: boolean;
  currentSurahId: number | null;
  currentVerseId: number | null;
  isLoading: boolean;
}

export interface SettingsState {
  arabicFont: ArabicFont;
  arabicFontSize: number;
  translationFontSize: number;
  showTranslation: boolean;
  showTransliteration: boolean;
  theme: 'dark' | 'light';
}

export type ArabicFont = 'uthmanic' | 'amiri' | 'scheherazade';

export interface BookmarkItem {
  surahId: number;
  verseId: number;
  surahName: string;
  verseText: string;
  addedAt: number;
}

export interface SearchResult {
  surahId: number;
  surahName: string;
  surahTransliteration: string;
  verseNumber: number;
  verseKey: string;
  arabicText: string;
  translation: string;
}
