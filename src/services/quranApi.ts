import axios from 'axios';
import { Surah, Verse } from '@/types';
import { SURAHS_META } from '@/data/surahs';

const BASE_URL = 'https://api.alquran.cloud/v1';

interface AlQuranVerse {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

interface AlQuranSurahResponse {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: AlQuranVerse[];
}

export async function fetchSurahWithTranslation(
  surahId: number
): Promise<Surah> {
  const [arabicRes, translationRes] = await Promise.all([
    axios.get(`${BASE_URL}/surah/${surahId}`),
    axios.get(`${BASE_URL}/surah/${surahId}/en.asad`),
  ]);

  const arabicData: AlQuranSurahResponse = arabicRes.data.data;
  const translationData: AlQuranSurahResponse = translationRes.data.data;

  const meta = SURAHS_META.find((s) => s.id === surahId)!;

  const verses: Verse[] = arabicData.ayahs.map((ayah, index) => ({
    id: ayah.number,
    verse_number: ayah.numberInSurah,
    verse_key: `${surahId}:${ayah.numberInSurah}`,
    text: ayah.text,
    translation: translationData.ayahs[index]?.text ?? '',
    audio_url: getAudioUrl(surahId, ayah.numberInSurah),
  }));

  return {
    ...meta,
    verses,
  };
}

export function getAudioUrl(surahId: number, verseNumber: number): string {
  const surahPadded = String(surahId).padStart(3, '0');
  const versePadded = String(verseNumber).padStart(3, '0');
  return `https://everyayah.com/data/Alafasy_128kbps/${surahPadded}${versePadded}.mp3`;
}

export function getSurahAudioUrl(surahId: number): string {
  const surahPadded = String(surahId).padStart(3, '0');
  return `https://download.quranicaudio.com/quran/mishaari_raashid_al-3afaasee/${surahPadded}.mp3`;
}

export { SURAHS_META };
