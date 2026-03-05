import { BirdIcon } from 'lucide-react';
import { div } from 'motion/react-client';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const size = parseInt(searchParams.get('size') || '512', 10);

  return new ImageResponse(
    (
      <div style={{
        background: 'transparent',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div
          style={{
            background: '#000000',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: size * 0.5,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            borderRadius: size * 0.2,
            border: `${size * 0.02}px solid rgba(255,255,255,0.2)`,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={size*0.8} height={size*0.8} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bird-icon lucide-bird"><path d="M16 7h.01" /><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" /><path d="m20 7 2 .5-2 .5" /><path d="M10 18v3" /><path d="M14 17.75V21" /><path d="M7 18a6 6 0 0 0 3.84-10.61" /></svg>
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
