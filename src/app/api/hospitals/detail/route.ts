import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get('place_id');
    
    console.log('[API] Request detail rumah sakit dengan place_id:', placeId);
    
    if (!placeId) {
      return NextResponse.json({ error: 'Place ID diperlukan' }, { status: 400 });
    }
    
    // Gunakan Google Places Detail API untuk mendapatkan info detail
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (API_KEY) {
      console.log('[API] Mencoba mengambil detail dari Google Places API');
      const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,international_phone_number,opening_hours,website&key=${API_KEY}`;
      
      const response = await fetch(detailUrl, {
        headers: { 'Accept': 'application/json' }
      });
      
      console.log('[API] Google Places Detail API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[API] Detail data berhasil didapatkan');
        return NextResponse.json(data);
      } else {
        console.error('[API] Error saat mengambil detail:', response.statusText);
      }
    } else {
      console.warn('[API] Google API Key tidak tersedia');
    }
    
    // Fallback jika API tidak tersedia
    console.log('[API] Menggunakan data fallback kosong untuk detail');
    return NextResponse.json({
      result: {
        formatted_phone_number: '',
        international_phone_number: '',
        opening_hours: { weekday_text: [] },
        website: ''
      }
    });
    
  } catch (error) {
    console.error('[API] Error saat mengambil detail rumah sakit:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil detail rumah sakit' },
      { status: 500 }
    );
  }
}