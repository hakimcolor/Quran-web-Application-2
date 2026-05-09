import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat');
  const lng = req.nextUrl.searchParams.get('lng');

  try {
    let url: string;

    if (lat && lng) {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=2`;
    } else {
      // fallback to Mecca
      url =
        'https://api.aladhan.com/v1/timingsByCity?city=Mecca&country=SA&method=4';
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('Upstream error');

    const json = await res.json();
    const timings = json.data.timings;
    const timezone = json.data.meta?.timezone ?? 'Mecca';

    return Response.json({ timings, timezone });
  } catch {
    return Response.json(
      { error: 'Failed to fetch prayer times' },
      { status: 502 }
    );
  }
}
