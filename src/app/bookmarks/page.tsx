'use client';
import { useRouter } from 'next/navigation';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useQuranStore } from '@/store/quranStore';

export default function BookmarksPage() {
  const router = useRouter();
  const { bookmarks, removeBookmark } = useQuranStore();

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Bookmark size={22} className="text-green-400" />
          <h1 className="text-xl font-semibold text-white">Bookmarks</h1>
          <span className="ml-auto text-sm text-gray-500">
            {bookmarks.length} saved
          </span>
        </div>

        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <Bookmark size={40} className="text-gray-700" />
            <p className="text-gray-500 text-sm">No bookmarks yet.</p>
            <p className="text-gray-600 text-xs">
              Tap the bookmark icon on any verse to save it here.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {bookmarks
              .slice()
              .sort((a, b) => b.addedAt - a.addedAt)
              .map((bm) => (
                <li
                  key={`${bm.surahId}-${bm.verseId}`}
                  className="group bg-[#111] border border-[#1e1e1e] rounded-xl p-4 flex gap-3 hover:border-[#2a2a2a] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-green-400 font-medium mb-1">
                      {bm.surahName} · Verse {bm.verseId}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 font-arabic text-right dir-rtl">
                      {bm.verseText}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        router.push(`/surah/${bm.surahId}#verse-${bm.verseId}`)
                      }
                      aria-label="Go to verse"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-green-400 hover:bg-green-500/10 transition-all"
                    >
                      <ArrowRight size={15} />
                    </button>
                    <button
                      onClick={() => removeBookmark(bm.surahId, bm.verseId)}
                      aria-label="Remove bookmark"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}
