'use client';
import { useState } from 'react';
import { IconSidebar } from '@/components/sidebar/IconSidebar';
import { SurahSidebar } from '@/components/sidebar/SurahSidebar';
import { RightPanel } from '@/components/settings/RightPanel';
import { ReaderTopBar } from '@/components/reader/ReaderTopBar';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { MobileDrawer } from '@/components/mobile/MobileDrawer';
import { SettingsPanel } from '@/components/settings/SettingsPanel';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden fixed inset-0">
      {/* Left icon sidebar — desktop only */}
      <div className="hidden md:flex shrink-0">
        <IconSidebar />
      </div>

      {/* Surah list sidebar — desktop only */}
      <div className="hidden md:flex shrink-0">
        <SurahSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden">
          <MobileHeader
            onMenuOpen={() => setMobileDrawerOpen(true)}
            onSettingsToggle={() => setMobileSettingsOpen((v) => !v)}
          />
        </div>

        {/* Desktop top bar */}
        <div className="hidden md:block shrink-0">
          <ReaderTopBar />
        </div>

        {/* Reader */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Right panel — always visible on desktop */}
      <div className="hidden md:flex shrink-0">
        <RightPanel />
      </div>

      {/* Mobile settings slide-out */}
      <SettingsPanel
        open={mobileSettingsOpen}
        onClose={() => setMobileSettingsOpen(false)}
      />

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </div>
  );
}
