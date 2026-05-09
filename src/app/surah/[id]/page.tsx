import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/AppLayout';
import { SurahReader } from '@/components/reader/SurahReader';
import { SURAHS_META } from '@/data/surahs';

interface SurahPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return SURAHS_META.map((s) => ({ id: String(s.id) }));
}

export async function generateMetadata({
  params,
}: SurahPageProps): Promise<Metadata> {
  const { id } = await params;
  const surahId = Number(id);
  const surah = SURAHS_META.find((s) => s.id === surahId);

  if (!surah) return { title: 'Surah Not Found' };

  return {
    title: `${surah.transliteration} — ${surah.translation} | Quran`,
    description: `Read Surah ${surah.transliteration} (${surah.translation}) with Arabic text and English translation. ${surah.total_verses} verses.`,
  };
}

export default async function SurahPage({ params }: SurahPageProps) {
  const { id } = await params;
  const surahId = Number(id);

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    notFound();
  }

  return (
    <AppLayout>
      <SurahReader surahId={surahId} />
    </AppLayout>
  );
}
