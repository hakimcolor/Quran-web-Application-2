'use client';
import { PrayerTimes } from './PrayerTimes';
import { useState, type FormEvent, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
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
  Globe,
  Mail,
  MessageCircle,
  Headphones,
  BookMarked,
  Sparkles,
  Shield,
  Zap,
  Users,
} from 'lucide-react';
import { SURAHS_META } from '@/data/surahs';
import { useSettingsStore, AppTheme } from '@/store/settingsStore';
import { cn } from '@/lib/utils';

/* ── Scroll-reveal wrapper ── */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const THEMES: { value: AppTheme; icon: React.ReactNode; label: string }[] = [
  { value: 'dark', icon: <Moon size={16} />, label: 'Dark' },
  { value: 'light', icon: <Sun size={16} />, label: 'Light' },
  { value: 'gray', icon: <Sunset size={16} />, label: 'Gray' },
  { value: 'sepia', icon: <Coffee size={16} />, label: 'Sepia' },
];

const FEATURED = [1, 2, 36, 55, 67, 18, 56, 112];
type GridTab = 'Surah' | 'Juz' | 'Page';

/* SVG brand icons */
const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const IconGitHub = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const IconInstagram = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    label: 'Portfolio',
    href: 'https://hakimcolorportfolio.vercel.app/',
    icon: <Globe size={16} />,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/md-azizul-hakim-b646b22a7',
    icon: <IconLinkedIn />,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/hakimcolor',
    icon: <IconGitHub />,
  },
  { label: 'X', href: 'https://x.com/hakimcolor', icon: <IconX /> },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/hakim.color/',
    icon: <IconInstagram />,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/hakimcolorofficial',
    icon: <IconFacebook />,
  },
  {
    label: 'WhatsApp',
    href: 'https://api.whatsapp.com/send/?phone=8801818777856&text&type=phone_number&app_absent=0',
    icon: <MessageCircle size={16} />,
  },
  {
    label: 'Email',
    href: 'mailto:hakimcolor777@gmail.com',
    icon: <Mail size={16} />,
  },
];

const FEATURES = [
  {
    icon: <BookOpen size={22} className="text-green-400" />,
    title: 'Full Arabic Text',
    desc: 'All 114 surahs with authentic Uthmanic script and multiple font choices.',
  },
  {
    icon: <Headphones size={22} className="text-green-400" />,
    title: 'Audio Recitation',
    desc: 'Listen to every verse with Mishary Alafasy recitation, verse by verse.',
  },
  {
    icon: <BookMarked size={22} className="text-green-400" />,
    title: 'Smart Bookmarks',
    desc: 'Save any verse and return to it instantly across sessions.',
  },
  {
    icon: <Search size={22} className="text-green-400" />,
    title: 'Powerful Search',
    desc: 'Search by Arabic text or English translation across all 6,236 verses.',
  },
  {
    icon: <Sparkles size={22} className="text-green-400" />,
    title: 'Beautiful Themes',
    desc: 'Dark, Light, Gray and Sepia — read comfortably day or night.',
  },
  {
    icon: <Zap size={22} className="text-green-400" />,
    title: 'Lightning Fast',
    desc: 'Statically generated pages load instantly, even on slow connections.',
  },
];

const STATS = [
  { value: '114', label: 'Surahs' },
  { value: '6,236', label: 'Verses' },
  { value: '30', label: 'Juz' },
  { value: '4', label: 'Themes' },
];

const DAILY_VERSES = [
  {
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'For indeed, with hardship will be ease.',
    ref: 'Al-Inshirah 94:5',
    id: 94,
  },
  {
    arabic: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ',
    translation: 'And He is with you wherever you are.',
    ref: 'Al-Hadid 57:4',
    id: 57,
  },
  {
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    translation:
      'Allah is sufficient for us, and He is the best disposer of affairs.',
    ref: 'Al-Imran 3:173',
    id: 3,
  },
];

export function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [gridTab, setGridTab] = useState<GridTab>('Surah');
  const [showAll, setShowAll] = useState(false);
  const [activeVerse, setActiveVerse] = useState(0);
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

  const visibleSurahs = showAll ? SURAHS_META : SURAHS_META.slice(0, 12);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Top Navigation ── */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/home" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-900/30">
              <span className="text-white font-bold text-sm">ق</span>
            </div>
            <span
              className="font-extrabold text-base hidden sm:block tracking-tight"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Quran Mazid
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground font-medium">
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
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Search size={17} />
            </Link>
            <button
              onClick={cycleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              {currentTheme.icon}
            </button>
            <Link
              href="/support"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-colors"
            >
              Support <Heart size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* animated water-like blobs */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-background/80 to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(76,175,80,0.08)_0%,transparent_70%)] pointer-events-none" />
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-500/5 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-green-400/5 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold mb-6 tracking-widest uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Read · Listen · Reflect
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-4"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Quran
            <br />
            <span className="text-green-400">Mazid</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg sm:text-xl mb-10 max-w-lg mx-auto leading-relaxed font-medium"
          >
            Read, Listen and Learn The Holy Quran — beautifully designed for
            every Muslim.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearch}
            className="relative max-w-lg mx-auto mb-8"
          >
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search surah or verse..."
              className="w-full bg-secondary border border-border rounded-2xl pl-11 pr-24 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-green-500/50 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-colors cursor-pointer"
            >
              Search
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-2 flex-wrap mb-10"
          >
            {[
              { label: 'Al-Baqara', id: 2 },
              { label: 'Yaseen', id: 36 },
              { label: 'Al-Mulk', id: 67 },
              { label: 'Al-Kahf', id: 18 },
            ].map((s) => (
              <Link
                key={s.id}
                href={`/surah/${s.id}`}
                className="px-4 py-1.5 rounded-full bg-secondary border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-green-500/40 transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              href="/surah/1"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-base font-bold transition-all shadow-lg shadow-green-900/30 hover:shadow-green-900/50 hover:-translate-y-0.5"
            >
              <Play size={16} fill="white" /> Start Reading Al-Fatiha
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <Reveal>
        <section className="border-y border-border bg-card/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p
                  className="text-3xl font-extrabold text-green-400"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Prayer Times ── */}
      <Reveal className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <PrayerTimes />
      </Reveal>

      {/* ── Daily Verse ── */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              ✨ Verse of the Day
            </h2>
            <div className="flex gap-1">
              {DAILY_VERSES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveVerse(i)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all cursor-pointer',
                    i === activeVerse
                      ? 'bg-green-400 w-5'
                      : 'bg-border hover:bg-muted-foreground'
                  )}
                />
              ))}
            </div>
          </div>
          <motion.div
            key={activeVerse}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-2xl bg-card border border-border overflow-hidden p-6 sm:p-10"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-green-500/0 via-green-500 to-green-500/0" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-green-500/5 blur-2xl pointer-events-none" />
            <p
              className="text-3xl sm:text-4xl text-right text-foreground leading-loose mb-6 font-medium"
              dir="rtl"
              lang="ar"
              style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
            >
              {DAILY_VERSES[activeVerse].arabic}
            </p>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4 italic">
              &ldquo;{DAILY_VERSES[activeVerse].translation}&rdquo;
            </p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-green-400 font-semibold bg-green-500/10 px-3 py-1 rounded-full">
                {DAILY_VERSES[activeVerse].ref}
              </span>
              <Link
                href={`/surah/${DAILY_VERSES[activeVerse].id}`}
                className="text-xs text-muted-foreground hover:text-green-400 transition-colors font-medium flex items-center gap-1"
              >
                Read full surah <ChevronRight size={13} />
              </Link>
            </div>
          </motion.div>
        </section>
      </Reveal>

      {/* ── Collection Row ── */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Collection
            </h2>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="px-2.5 py-1 rounded-lg bg-secondary border border-border font-semibold">
                Last Reads
              </span>
              <span className="px-2.5 py-1 rounded-lg hover:bg-secondary cursor-pointer transition-colors">
                Bookmarks
              </span>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {FEATURED.map((id, i) => {
              const s = SURAHS_META.find((x) => x.id === id)!;
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={`/surah/${id}`}
                    className="shrink-0 w-32 p-4 rounded-2xl bg-card border border-border hover:border-green-500/30 hover:bg-secondary/50 transition-all group block"
                  >
                    <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center mb-3 group-hover:bg-green-500/20 transition-colors">
                      <BookOpen size={15} className="text-green-500" />
                    </div>
                    <p className="text-sm font-semibold truncate">
                      {s.transliteration}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {s.translation}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {s.total_verses} verses
                    </p>
                  </Link>
                </motion.div>
              );
            })}
            <button className="shrink-0 w-9 self-center flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ChevronRight size={20} />
            </button>
          </div>
        </section>
      </Reveal>

      {/* ── Features Grid (NEW) ── */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
          <div className="text-center mb-10">
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Everything you need to connect with the Quran
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              A complete Quran experience — read, listen, search and reflect,
              all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="p-5 rounded-2xl bg-card border border-border hover:border-green-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Surah Grid ── */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              All Surahs
            </h2>
            <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
              {(['Surah', 'Juz', 'Page'] as GridTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setGridTab(t)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer',
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {visibleSurahs.map((surah, i) => (
              <motion.div
                key={surah.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
              >
                <Link
                  href={`/surah/${surah.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 bg-background hover:bg-secondary/60 transition-colors group"
                >
                  <span className="shrink-0 w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground group-hover:bg-green-500/10 group-hover:text-green-400 transition-colors">
                    {surah.id}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {surah.transliteration}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {surah.translation}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-base text-muted-foreground"
                      dir="rtl"
                      lang="ar"
                      style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
                    >
                      {surah.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {surah.total_verses}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          {!showAll && (
            <div className="text-center mt-5">
              <button
                onClick={() => setShowAll(true)}
                className="px-6 py-2.5 rounded-xl bg-secondary border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-green-500/30 transition-colors cursor-pointer"
              >
                Show All 114 Surahs ↓
              </button>
            </div>
          )}
        </section>
      </Reveal>

      {/* ── Why Quran Mazid (NEW) ── */}
      <Reveal>
        <section className="relative overflow-hidden py-16 mb-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(76,175,80,0.06)_0%,transparent_60%)] pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <h2
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  Why choose
                  <br />
                  <span className="text-green-400">Quran Mazid?</span>
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 max-w-md mx-auto lg:mx-0">
                  Built with care for the Muslim community — clean, fast, and
                  distraction-free. No ads, no clutter. Just you and the words
                  of Allah.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link
                    href="/surah/1"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-all hover:-translate-y-0.5"
                  >
                    <Play size={14} fill="white" /> Start Reading
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-secondary border border-border text-sm font-semibold hover:border-green-500/30 transition-all"
                  >
                    <Search size={14} /> Search Verses
                  </Link>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3 w-full max-w-sm lg:max-w-none">
                {[
                  {
                    icon: <Shield size={18} className="text-green-400" />,
                    title: 'Authentic Text',
                    desc: 'Verified Uthmanic script',
                  },
                  {
                    icon: <Zap size={18} className="text-green-400" />,
                    title: 'Instant Load',
                    desc: 'Statically generated',
                  },
                  {
                    icon: <Users size={18} className="text-green-400" />,
                    title: 'For Everyone',
                    desc: 'Mobile & desktop ready',
                  },
                  {
                    icon: <Heart size={18} className="text-green-400" />,
                    title: 'Free Forever',
                    desc: 'No subscription needed',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-2xl bg-card border border-border"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center mb-2">
                      {item.icon}
                    </div>
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── App Download Banner ── */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          <div className="rounded-2xl bg-card border border-border overflow-hidden p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1">
              <h3
                className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight leading-tight"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Download The App
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-sm">
                Access the full Quran with translations, Juz, Ruku, beautiful
                recitation and memorization tools.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm font-semibold hover:border-green-500/30 transition-colors"
                >
                  <Download size={14} /> Google Play
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm font-semibold hover:border-green-500/30 transition-colors"
                >
                  <Download size={14} /> App Store
                </a>
              </div>
            </div>
            <div className="shrink-0 w-28 h-44 sm:w-36 sm:h-56 rounded-2xl bg-secondary border border-border flex items-center justify-center opacity-50">
              <BookOpen size={36} className="text-muted-foreground" />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Sadaqah Jariyah ── */}
      <Reveal>
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-background via-black/40 to-background pointer-events-none" />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-500/5 blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative text-center px-4 sm:px-6">
            <h2
              className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Be part of Sadaqah Jariyah
            </h2>
            <p className="text-muted-foreground text-base mb-8 max-w-md mx-auto leading-relaxed">
              Your support helps spread the knowledge of Islam to brothers and
              sisters around the world.
            </p>
            <Link
              href="/support"
              className="inline-block px-8 py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-base font-bold transition-all shadow-lg shadow-green-900/30 hover:-translate-y-0.5"
            >
              I want to support 💚
            </Link>
          </div>
        </section>
      </Reveal>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">ق</span>
              </div>
              <span
                className="font-extrabold text-base tracking-tight"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Quran Mazid
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A beautiful Quran reading experience with Arabic text,
              translations, and audio recitation for all 114 surahs.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-4 tracking-tight">
              Other Pages
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
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
          <div>
            <h4 className="text-sm font-bold mb-4 tracking-tight">
              Important Links
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
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
          <div>
            <h4 className="text-sm font-bold mb-4 tracking-tight">
              Contact Us
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-green-400 hover:border-green-500/40 hover:bg-green-500/10 transition-all"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Quran Mazid. Built with ❤️ by{' '}
          <a
            href="https://hakimcolorportfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 transition-colors font-semibold"
          >
            Hakim Color
          </a>
        </div>
      </footer>
    </div>
  );
}
