import { Metadata } from 'next';
import { AppLayout } from '@/components/layout/AppLayout';
import { SearchPage } from '@/components/shared/SearchPage';

export const metadata: Metadata = {
  title: 'Search — Quran',
  description:
    'Search through all 114 surahs of the Quran by Arabic text or English translation.',
};

export default function Search() {
  return (
    <AppLayout>
      <SearchPage />
    </AppLayout>
  );
}
