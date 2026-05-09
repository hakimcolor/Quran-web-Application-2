import { Surah } from '@/types';
import { SURAHS_META } from '@/data/surahs';

/**
 * Fetch a surah with verses + translation.
 * Calls our own Next.js Route Handler (/api/surah/[id])
 * which proxies api.alquran.cloud server-side.
 */
export async function fetchSurahWithTranslation(
  surahId: number
): Promise<Surah> {
  const res = await fetch(`/api/surah/${surahId}`);
  if (!res.ok) throw new Error(`Failed to fetch surah ${surahId}`);
  return res.json();
}

export function getAudioUrl(surahId: number, verseNumber: number): string {
  const s = String(surahId).padStart(3, '0');
  const v = String(verseNumber).padStart(3, '0');
  return `https://everyayah.com/data/Alafasy_128kbps/${s}${v}.mp3`;
}

export function getSurahAudioUrl(surahId: number): string {
  const s = String(surahId).padStart(3, '0');
  return `https://download.quranicaudio.com/quran/mishaari_raashid_al-3afaasee/${s}.mp3`;
}

export { SURAHS_META };
