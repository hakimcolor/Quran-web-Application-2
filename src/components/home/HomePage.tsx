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
