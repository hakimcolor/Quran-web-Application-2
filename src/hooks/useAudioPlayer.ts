'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useAudioStore } from '@/store/audioStore';
import { getAudioUrl } from '@/services/quranApi';
import { Verse } from '@/types';

export function useAudioPlayer(verses?: Verse[], surahId?: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    isPlaying,
    currentSurahId,
    currentVerseId,
    isLoading,
    duration,
    currentTime,
    setPlaying,
    setCurrentTrack,
    setLoading,
    setAudioRef,
    setDuration,
    setCurrentTime,
    stop,
  } = useAudioStore();

  /* Play a specific verse by verse_number */
  const playByNumber = useCallback(
    async (sid: number, verseId: number, verseNumber: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      setLoading(true);
      setCurrentTrack(sid, verseId);
      audio.src = getAudioUrl(sid, verseNumber);
      audio.load();
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
        setLoading(false);
      }
    },
    [setLoading, setCurrentTrack, setPlaying]
  );

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      setAudioRef(audioRef.current);
    }
    const audio = audioRef.current;

    /* Auto-play next verse when current ends */
    const onEnded = () => {
      setPlaying(false);
      if (verses && surahId && currentVerseId !== null) {
        const idx = verses.findIndex((v) => v.id === currentVerseId);
        const next = verses[idx + 1];
        if (next) {
          // small delay so it feels natural
          setTimeout(
            () => playByNumber(surahId, next.id, next.verse_number),
            300
          );
        }
      }
    };

    const onCanPlay = () => setLoading(false);
    const onWaiting = () => setLoading(true);
    const onMeta = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('timeupdate', onTime);

    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('timeupdate', onTime);
    };
  }, [
    setPlaying,
    setLoading,
    setAudioRef,
    setDuration,
    setCurrentTime,
    verses,
    surahId,
    currentVerseId,
    playByNumber,
  ]);

  /* Toggle play/pause or start a new verse */
  const playVerse = useCallback(
    async (sid: number, verseId: number, verseNumber: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      // same verse → toggle
      if (currentSurahId === sid && currentVerseId === verseId) {
        if (isPlaying) {
          audio.pause();
          setPlaying(false);
        } else {
          await audio.play();
          setPlaying(true);
        }
        return;
      }

      await playByNumber(sid, verseId, verseNumber);
    },
    [currentSurahId, currentVerseId, isPlaying, setPlaying, playByNumber]
  );

  const pauseAudio = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, [setPlaying]);
  const stopAudio = useCallback(() => stop(), [stop]);

  const isVerseActive = useCallback(
    (sid: number, vid: number) =>
      currentSurahId === sid && currentVerseId === vid,
    [currentSurahId, currentVerseId]
  );
  const isVersePlaying = useCallback(
    (sid: number, vid: number) => isVerseActive(sid, vid) && isPlaying,
    [isVerseActive, isPlaying]
  );

  return {
    isPlaying,
    isLoading,
    currentSurahId,
    currentVerseId,
    duration,
    currentTime,
    playVerse,
    pauseAudio,
    stopAudio,
    isVerseActive,
    isVersePlaying,
  };
}
