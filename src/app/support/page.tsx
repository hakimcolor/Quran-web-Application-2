import { AppLayout } from '@/components/layout/AppLayout';
import { Heart } from 'lucide-react';

export default function SupportPage() {
  return (
    <AppLayout>
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-6">
          <Heart size={28} className="text-rose-400" />
        </div>

        <h1
          className="text-2xl font-bold text-[var(--foreground)] mb-3"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Support Us
        </h1>

        <p className="text-[var(--muted-foreground)] leading-relaxed mb-8 text-sm">
          Help spread the knowledge of Islam. Your regular support helps us
          reach our religious brothers and sisters with the message of Islam.
          Join our mission and be part of the big change.
        </p>

        <a
          href="mailto:support@quranapp.com"
          className="inline-block px-8 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Support Us
        </a>
      </div>
    </AppLayout>
  );
}
