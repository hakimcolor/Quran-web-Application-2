'use client';
import { create } from 'zustand';

interface AudioStore {
  isPlaying: boolean;
  currentSurahId: number | null;
  currentVerseId: number | null;
  isLoading: boolean;
  duration: number; // track duration in seconds
  currentTime: number;
  audioRef: HTMLAudioElement | null;
  setPlaying: (playing: boolean) => void;
  setCurrentTrack: (surahId: number, verseId: number) => void;
  setLoading: (loading: boolean) => void;
  setAudioRef: (ref: HTMLAudioElement | null) => void;
  setDuration: (d: number) => void;
  setCurrentTime: (t: number) => void;
  stop: () => void;
}

export const useAudioStore = create<AudioStore>()((set, get) => ({
  isPlaying: false,
  currentSurahId: null,
  currentVerseId: null,
  isLoading: false,
  duration: 0,
  currentTime: 0,
  audioRef: null,
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTrack: (surahId, verseId) =>
    set({
      currentSurahId: surahId,
      currentVerseId: verseId,
      duration: 0,
      currentTime: 0,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
  setAudioRef: (ref) => set({ audioRef: ref }),
  setDuration: (d) => set({ duration: d }),
  setCurrentTime: (t) => set({ currentTime: t }),
  stop: () => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }
    set({
      isPlaying: false,
      currentSurahId: null,
      currentVerseId: null,
      duration: 0,
      currentTime: 0,
    });
  },
}));
