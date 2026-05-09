'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useAudioStore } from '@/store/audioStore';
import { getAudioUrl } from '@/services/quranApi';

export function useAudioPlayer() {
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

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      setAudioRef(audioRef.current);
    }
    const audio = audioRef.current;

    const onEnded = () => setPlaying(false);
    const onCanPlay = () => setLoading(false);
    const onWaiting = () => setLoading(true);
    // track duration when metadata loads
    const onMeta = () => setDuration(audio.duration || 0);
    // track current time
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
  }, [setPlaying, setLoading, setAudioRef, setDuration, setCurrentTime]);

  const playVerse = useCallback(
    async (surahId: number, verseId: number, verseNumber: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      // toggle if same verse
      if (currentSurahId === surahId && currentVerseId === verseId) {
        if (isPlaying) {
          audio.pause();
          setPlaying(false);
        } else {
          await audio.play();
          setPlaying(true);
        }
        return;
      }

      audio.pause();
      setLoading(true);
      setCurrentTrack(surahId, verseId);
      audio.src = getAudioUrl(surahId, verseNumber);
      audio.load();

      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
        setLoading(false);
      }
    },
    [
      currentSurahId,
      currentVerseId,
      isPlaying,
      setPlaying,
      setCurrentTrack,
      setLoading,
    ]
  );

  const pauseAudio = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, [setPlaying]);

  const stopAudio = useCallback(() => stop(), [stop]);

  const isVerseActive = useCallback(
    (surahId: number, verseId: number) =>
      currentSurahId === surahId && currentVerseId === verseId,
    [currentSurahId, currentVerseId]
  );

  const isVersePlaying = useCallback(
    (surahId: number, verseId: number) =>
      isVerseActive(surahId, verseId) && isPlaying,
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
