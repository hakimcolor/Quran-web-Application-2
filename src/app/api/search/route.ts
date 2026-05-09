import { NextRequest } from 'next/server';
import { SURAHS_META } from '@/data/surahs';

const ALQURAN_BASE = 'https://api.alquran.cloud/v1';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();

  if (!q) {
    return Response.json({ error: 'Missing query param: q' }, { status: 400 });
  }

  const qLower = q.toLowerCase();

  try {
    const results: Array<{
      surahId: number;
      surahName: string;
      surahTransliteration: string;
      verseNumber: number;
      verseKey: string;
      arabicText: string;
      translation: string;
    }> = [];

    await Promise.all(
      SURAHS_META.map(async (meta) => {
        try {
          const [arabicRes, translationRes] = await Promise.all([
            fetch(`${ALQURAN_BASE}/surah/${meta.id}`),
            fetch(`${ALQURAN_BASE}/surah/${meta.id}/en.asad`),
          ]);

          if (!arabicRes.ok || !translationRes.ok) return;

          const arabicJson = await arabicRes.json();
          const translationJson = await translationRes.json();

          const arabicAyahs: Array<{
            number: number;
            text: string;
            numberInSurah: number;
          }> = arabicJson.data.ayahs;

          const translationAyahs: Array<{ text: string }> =
            translationJson.data.ayahs;

          arabicAyahs.forEach((ayah, index) => {
            const translation = translationAyahs[index]?.text ?? '';
            if (
              ayah.text.includes(q) ||
              translation.toLowerCase().includes(qLower)
            ) {
              results.push({
                surahId: meta.id,
                surahName: meta.name,
                surahTransliteration: meta.transliteration,
                verseNumber: ayah.numberInSurah,
                verseKey: `${meta.id}:${ayah.numberInSurah}`,
                arabicText: ayah.text,
                translation,
              });
            }
          });
        } catch {
          /* skip failed surah */
        }
      })
    );

    return Response.json({
      results: results.slice(0, 100),
      total: results.length,
    });
  } catch {
    return Response.json({ error: 'Search failed' }, { status: 502 });
  }
}
