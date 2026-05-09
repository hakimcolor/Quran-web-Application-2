'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSettingsStore } from '@/store/settingsStore';

/* Applies theme-* class to <html> based on store */
function ThemeApplier() {
  const appTheme = useSettingsStore((s) => s.appTheme);
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove(
      'theme-dark',
      'theme-light',
      'theme-gray',
      'theme-sepia'
    );
    html.classList.add(`theme-${appTheme}`);
  }, [appTheme]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 1000 * 60 * 60, retry: 2 } },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <ThemeApplier />
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '14px',
            },
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
