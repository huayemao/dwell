'use client';

import { use } from 'react';
import { Player } from '@/components/Player';
import { Language } from '@/lib/i18n';
import { SCENES } from '@/lib/config';
import { notFound } from 'next/navigation';

export default function ScenePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = use(params);

  // 验证 slug 是否有效
  const scene = SCENES.find(s => s.id === slug);
  if (!scene) {
    notFound();
  }

  return (
    <Player
      lang={lang as Language}
      initialScene={slug}
      showBackButton={true}
      backUrl={`/${lang}/scenes`}
    />
  );
}
