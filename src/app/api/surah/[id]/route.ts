import { NextRequest } from 'next/server';
import { SURAHS_META } from '@/data/surahs';

const ALQURAN_BASE = 'https://api.alquran.cloud/v1';

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/surah/[id]'>
) {
  const { id } = await ctx.params;
  const surahId = Number(id);

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    return Response.json({ error: 'Invalid surah id' }, { status: 400 });
  }

  const meta = SURAHS_META.find((s) => s.id === surahId);
  if (!meta) {
    return Response.json({ error: 'Surah not found' }, { status: 404 });
  }

  try {
    const [arabicRes, translationRes] = await Promise.all([
      fetch(`${ALQURAN_BASE}/surah/${surahId}`),
      fetch(`${ALQURAN_BASE}/surah/${surahId}/en.asad`),
    ]);

    if (!arabicRes.ok || !translationRes.ok) {
      throw new Error('Upstream API error');
    }

    const arabicJson = await arabicRes.json();
    const translationJson = await translationRes.json();

    const arabicAyahs: Array<{
      number: number;
      text: string;
      numberInSurah: number;
    }> = arabicJson.data.ayahs;

    const translationAyahs: Array<{ text: string }> =
      translationJson.data.ayahs;

    const verses = arabicAyahs.map((ayah, index) => ({
      id: ayah.number,
      verse_number: ayah.numberInSurah,
      verse_key: `${surahId}:${ayah.numberInSurah}`,
      text: ayah.text,
      translation: translationAyahs[index]?.text ?? '',
      audio_url: getAudioUrl(surahId, ayah.numberInSurah),
    }));

    return Response.json({ ...meta, verses });
  } catch {
    return Response.json(
      { error: 'Failed to fetch surah data' },
      { status: 502 }
    );
  }
}

function getAudioUrl(surahId: number, verseNumber: number): string {
  const s = String(surahId).padStart(3, '0');
  const v = String(verseNumber).padStart(3, '0');
  return `https://everyayah.com/data/Alafasy_128kbps/${s}${v}.mp3`;
}
