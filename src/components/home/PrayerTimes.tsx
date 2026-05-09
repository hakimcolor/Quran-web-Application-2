'use client';
import { useEffect, useState } from 'react';
import { Clock, MapPin, Loader2 } from 'lucide-react';

interface Timings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface PrayerData {
  timings: Timings;
  city: string;
  date: string;
}

const PRAYER_NAMES: (keyof Timings)[] = [
  'Fajr',
  'Sunrise',
  'Dhuhr',
  'Asr',
  'Maghrib',
  'Isha',
];

/* Strip timezone suffix e.g. "05:30 (PKT)" → "05:30" */
function cleanTime(t: string) {
  return t.replace(/\s*\(.*\)/, '');
}

/* Find the next upcoming prayer */
function getNextPrayer(timings: Timings): keyof Timings {
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  for (const name of PRAYER_NAMES) {
    if (cleanTime(timings[name]) > hhmm) return name;
  }
  return 'Fajr'; // wrap to next day
}

export function PrayerTimes() {
  const [data, setData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    /* Get coords then fetch prayer times */
    navigator.geolocation?.getCurrentPosition(
      async ({ coords }) => {
        try {
          const today = new Date();
          const dd = String(today.getDate()).padStart(2, '0');
          const mm = String(today.getMonth() + 1).padStart(2, '0');
          const yyyy = today.getFullYear();

          const res = await fetch(
            `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=2`
          );
          const json = await res.json();
          const timings: Timings = json.data.timings;
          const city = json.data.meta.timezone ?? 'Your Location';

          setData({ timings, city, date: `${dd}/${mm}/${yyyy}` });
        } catch {
          setError('Could not load prayer times.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        /* Fallback: use Mecca coordinates */
        fetch(
          'https://api.aladhan.com/v1/timingsByCity?city=Mecca&country=SA&method=4'
        )
          .then((r) => r.json())
          .then((json) => {
            setData({
              timings: json.data.timings,
              city: 'Mecca (default)',
              date: '',
            });
          })
          .catch(() => setError('Could not load prayer times.'))
          .finally(() => setLoading(false));
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground text-sm">
        <Loader2 size={16} className="animate-spin text-green-500" />
        Loading prayer times...
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="text-center text-muted-foreground text-xs py-4">
        {error || 'Unavailable'}
      </p>
    );
  }

  const next = getNextPrayer(data.timings);

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-green-500" />
          <span className="text-sm font-semibold text-foreground">
            Prayer Times
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin size={11} />
          <span className="truncate max-w-[140px]">{data.city}</span>
        </div>
      </div>

      {/* Times grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-border">
        {PRAYER_NAMES.map((name) => {
          const isNext = name === next;
          return (
            <div
              key={name}
              className={`flex flex-col items-center py-4 px-2 transition-colors ${
                isNext ? 'bg-green-500/10' : 'hover:bg-secondary/50'
              }`}
            >
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${isNext ? 'text-green-400' : 'text-muted-foreground'}`}
              >
                {name}
              </span>
              <span
                className={`text-sm font-bold tabular-nums ${isNext ? 'text-green-400' : 'text-foreground'}`}
              >
                {cleanTime(data.timings[name])}
              </span>
              {isNext && (
                <span className="text-[9px] text-green-500 mt-0.5 font-medium">
                  Next
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
