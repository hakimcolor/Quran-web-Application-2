'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Bookmark,
  Search,
  Settings,
  Heart,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface IconSidebarProps {
  onSettingsToggle?: () => void;
}

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Home', href: '/' },
  { id: 'quran', icon: BookOpen, label: 'Quran', href: '/surah/1' },
  { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
  { id: 'search', icon: Search, label: 'Search', href: '/search' },
];

export function IconSidebar({ onSettingsToggle }: IconSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('/').slice(0, 2).join('/'));
  };

  return (
    <motion.aside
      initial={{ x: -72 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-[72px] h-full bg-card border-r border-border flex flex-col items-center py-4 gap-1 z-30"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="mb-4 w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-900/30">
        <span className="text-white font-bold text-sm" aria-label="Quran App">
          ق
        </span>
      </div>

      {/* Nav items */}
      <div className="flex-1 flex flex-col items-center gap-1 w-full px-2">
        {NAV_ITEMS.map(({ id, icon: Icon, label, href }) => {
          const active = isActive(href);
          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  aria-label={label}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'w-full flex items-center justify-center h-11 rounded-xl transition-all duration-200 relative',
                    active
                      ? 'bg-green-500/15 text-green-400'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-green-500 rounded-r-full"
                    />
                  )}
                  <Icon size={20} strokeWidth={active ? 2 : 1.5} />
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[#1c1c1c] border-[#2a2a2a] text-white text-xs"
              >
                {label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Bottom: settings + support */}
      <div className="flex flex-col items-center gap-1 w-full px-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onSettingsToggle?.()}
              aria-label="Settings"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <Settings size={20} strokeWidth={1.5} />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-[#1c1c1c] border-[#2a2a2a] text-white text-xs"
          >
            Settings
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/support"
              aria-label="Support Us"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
            >
              <Heart size={18} strokeWidth={1.5} />
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-[#1c1c1c] border-[#2a2a2a] text-white text-xs"
          >
            Support Us
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.aside>
  );
}
