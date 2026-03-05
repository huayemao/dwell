'use client';

import { use } from 'react';
import { Player } from '@/components/Player';
import { Language } from '@/lib/i18n';

export default function PlayPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);

  return <Player lang={lang as Language} showBackButton={true} />;
}
