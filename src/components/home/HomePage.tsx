'use client';
import { PrayerTimes } from './PrayerTimes';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  Moon,
  Sun,
  Sunset,
  Coffee,
  Heart,
  ChevronRight,
  Play,
  Download,
} from 'lucide-react';
import { SURAHS_META } from '@/data/surahs';
import { useSettingsStore, AppTheme } from '@/store/settingsStore';
import { cn } from '@/lib/utils';

/* ── Top nav ── */
const THEMES: { value: AppTheme; icon: React.ReactNode; label: string }[] = [
  { value: 'dark', icon: <Moon size={15} />, label: 'Dark' },
  { value: 'light', icon: <Sun size={15} />, label: 'Light' },
  { value: 'gray', icon: <Sunset size={15} />, label: 'Gray' },
  { value: 'sepia', icon: <Coffee size={15} />, label: 'Sepia' },
];

/* Featured surahs shown in Collection row */
const FEATURED = [1, 2, 36, 55, 67, 18, 56, 112];

/* Surah grid tabs */
type GridTab = 'Surah' | 'Juz' | 'Page';

export function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [gridTab, setGridTab] = useState<GridTab>('Surah');
  const [showAll, setShowAll] = useState(false);
  const { appTheme, setAppTheme } = useSettingsStore();

  const cycleTheme = () => {
    const idx = THEMES.findIndex((t) => t.value === appTheme);
    setAppTheme(THEMES[(idx + 1) % THEMES.length].value);
  };
  const currentTheme = THEMES.find((t) => t.value === appTheme) ?? THEMES[0];

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim())
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  /* Show 12 surahs in grid, or all if expanded */
  const visibleSurahs = showAll ? SURAHS_META : SURAHS_META.slice(0, 12);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Top Navigation ── */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">ق</span>
            </div>
            <span className="text-foreground font-bold text-sm hidden sm:block">
              Quran Mazid
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-5 text-xs text-muted-foreground">
            <Link
              href="/home"
              className="hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/surah/1"
              className="hover:text-foreground transition-colors"
            >
              Read Quran
            </Link>
            <Link
              href="/bookmarks"
              className="hover:text-foreground transition-colors"
            >
              Bookmarks
            </Link>
            <Link
              href="/search"
              className="hover:text-foreground transition-colors"
            >
              Search
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Search size={16} />
            </Link>
            <button
              onClick={cycleTheme}
              aria-label="Toggle theme"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {currentTheme.icon}
            </button>
            <Link
              href="/support"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-colors"
            >
              Support Us <Heart size={12} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-background/80 to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(76,175,80,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-4 pt-16 pb-12 text-center">
          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl font-bold text-foreground mb-2 tracking-tight"
            style={{
              fontFamily: "'Noto Naskh Arabic', serif",
              letterSpacing: '0.05em',
            }}
          >
            Quran Mazid
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Read, Listen and Learn The Quran
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="relative max-w-md mx-auto mb-6"
          >
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to read?"
              className="w-full bg-secondary border border-border rounded-xl pl-9 pr-16 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-green-500/50 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-medium transition-colors"
            >
              Go →
            </button>
          </form>

          {/* Quick action pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
            {[
              { label: 'Al-Baqara', id: 2 },
              { label: 'Yaseen', id: 36 },
              { label: 'Al-Mulk', id: 67 },
              { label: 'Al-Kahf', id: 18 },
            ].map((s) => (
              <Link
                key={s.id}
                href={`/surah/${s.id}`}
                className="px-3 py-1 rounded-full bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground hover:border-green-500/40 transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>

          {/* Tagline */}
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Let the words of the Quran guide you. Whether you choose to read,
            search or listen, we are here to help you on your journey to
            understanding Islam.
          </p>
          <Link
            href="/surah/1"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors"
          >
            <Play size={12} /> Go to Al-Fatiha · 7
          </Link>
        </div>
      </section>

      {/* ── Prayer Times ── */}
      <section className="max-w-6xl mx-auto px-4 pb-2">
        <PrayerTimes />
      </section>

      {/* ── Collection Row ── */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Collection</h2>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="px-2 py-0.5 rounded bg-secondary border border-border">
              Last Reads
            </span>
            <span className="px-2 py-0.5 rounded hover:bg-secondary cursor-pointer transition-colors">
              Bookmarks
            </span>
            <span className="px-2 py-0.5 rounded hover:bg-secondary cursor-pointer transition-colors">
              All
            </span>
          </div>
        </div>

        {/* Horizontal scroll row */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {FEATURED.map((id) => {
            const s = SURAHS_META.find((x) => x.id === id)!;
            return (
              <Link
                key={id}
                href={`/surah/${id}`}
                className="shrink-0 w-28 p-3 rounded-xl bg-card border border-border hover:border-green-500/30 hover:bg-secondary/50 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center mb-2 group-hover:bg-green-500/20 transition-colors">
                  <BookOpen size={14} className="text-green-500" />
                </div>
                <p className="text-xs font-medium text-foreground truncate">
                  {s.transliteration}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {s.translation}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Ayah · {s.total_verses}
                </p>
              </Link>
            );
          })}
          <button className="shrink-0 w-8 self-center flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Surah Grid ── */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Quran Mazid</h2>
          {/* Surah / Juz / Page tabs */}
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
            {(['Surah', 'Juz', 'Page'] as GridTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setGridTab(t)}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                  gridTab === t
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 3-column surah grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {visibleSurahs.map((surah) => (
            <Link
              key={surah.id}
              href={`/surah/${surah.id}`}
              className="flex items-center gap-3 px-4 py-3 bg-background hover:bg-secondary/60 transition-colors group"
            >
              {/* Number badge */}
              <span className="shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-green-500/10 group-hover:text-green-400 transition-colors">
                {surah.id}
              </span>

              {/* English info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {surah.transliteration}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {surah.translation}
                </p>
              </div>

              {/* Arabic name + verse count */}
              <div className="text-right shrink-0">
                <p
                  className="text-sm text-muted-foreground"
                  dir="rtl"
                  lang="ar"
                  style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
                >
                  {surah.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {surah.total_verses}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Show more */}
        {!showAll && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowAll(true)}
              className="px-5 py-2 rounded-lg bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground hover:border-green-500/30 transition-colors"
            >
              Show More ↓
            </button>
          </div>
        )}
      </section>

      {/* ── App Download Banner ── */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="relative rounded-2xl bg-card border border-border overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1">
              Download The App
              <br />
              <span style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
                Quran Majeed (القرآن الكريم)
              </span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 max-w-xs">
              Download the Quran Majeed app to access the full Quran with its
              translations, Juz, Ruku and many more. The Quran app also includes
              beautiful Quran recitation and memorization tools to improve your
              learning.
            </p>
            <div className="flex gap-2 flex-wrap">
              <a
                href="#"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-foreground hover:border-green-500/30 transition-colors"
              >
                <Download size={12} /> Google Play
              </a>
              <a
                href="#"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-foreground hover:border-green-500/30 transition-colors"
              >
                <Download size={12} /> App Store
              </a>
            </div>
          </div>
          {/* Phone mockup placeholder */}
          <div className="shrink-0 w-32 h-48 rounded-2xl bg-secondary border border-border flex items-center justify-center opacity-60">
            <BookOpen size={32} className="text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* ── Sadaqah Jariyah ── */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-background via-black/40 to-background pointer-events-none" />
        {/* Mosque silhouette hint */}
        <div className="absolute bottom-0 left-0 right-0 h-24 opacity-10 bg-linear-to-t from-green-900 to-transparent" />

        <div className="relative text-center px-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Be part of
            <br />
            Sadaqah Jariyah
          </h2>
          <Link
            href="/support"
            className="inline-block px-6 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors mb-8"
          >
            I want to support
          </Link>
          <p className="text-muted-foreground text-sm mb-4">Sadaqah Jariyah</p>
          <Link
            href="/support"
            className="inline-block px-6 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
          >
            I want to support
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">ق</span>
              </div>
              <span className="text-foreground font-bold text-sm">
                Quran Mazid
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              All translations, including Arabic texts for the benefit of
              Muslims, especially families from their communities to the lands
              and heavens for Sadaqah & Mercy of Allah & Gender.
            </p>
          </div>

          {/* Other Pages */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3">
              Other Pages
            </h4>
            <ul className="space-y-2 text-[11px] text-muted-foreground">
              {[
                'About Us',
                'Privacy Policy',
                'Our Projects',
                'News & Update',
              ].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3">
              Important Links
            </h4>
            <ul className="space-y-2 text-[11px] text-muted-foreground">
              {[
                '114 Foundation',
                'Quranmedia.com',
                'Dua & Ruqyah',
                'Hadith',
              ].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3">
              Contact Us
            </h4>
            <div className="flex flex-col gap-2">
              {[
                {
                  label: 'Portfolio',
                  href: 'https://hakimcolorportfolio.vercel.app/',
                },
                {
                  label: 'LinkedIn',
                  href: 'https://www.linkedin.com/in/md-azizul-hakim-b646b22a7',
                },
                { label: 'GitHub', href: 'https://github.com/hakimcolor' },
                { label: 'X (Twitter)', href: 'https://x.com/hakimcolor' },
                {
                  label: 'Instagram',
                  href: 'https://www.instagram.com/hakim.color/',
                },
                {
                  label: 'Facebook',
                  href: 'https://www.facebook.com/hakimcolorofficial',
                },
                {
                  label: 'WhatsApp',
                  href: 'https://api.whatsapp.com/send/?phone=8801818777856&text&type=phone_number&app_absent=0',
                },
                { label: 'Email', href: 'mailto:hakimcolor777@gmail.com' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="text-[11px] text-muted-foreground hover:text-green-400 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border px-4 py-3 text-center text-[10px] text-muted-foreground">
          © {new Date().getFullYear()} Quran Mazid. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
