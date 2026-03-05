import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const size = parseInt(searchParams.get('size') || '512', 10);

  return new ImageResponse(
    (
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
        D
      </div>
    ),
    { width: size, height: size }
  );
}
