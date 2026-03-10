
import { use } from 'react';
import { Player } from '@/components/Player';
import { Language, tScene, tSound } from '@/lib/i18n';
import { SCENES } from '@/lib/config';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  console.log(lang, slug);
  const sceneConfig = SCENES.find(s => s.id === slug);

  if (!sceneConfig) {
    return {
      title: 'Scene Not Found',
      description: 'The requested scene does not exist.',
    };
  }

  // 获取国际化的场景信息
  const scene = tScene(slug as any, lang as Language);

  // 获取国际化的声音元素
  const soundElements = Object.entries(sceneConfig.defaultMix)
    .map(([soundId, volume]) => {
      return tSound(soundId as any, lang as Language);
    })
    .filter(Boolean);

  const soundDescription = soundElements.length > 0
    ? `Features ${soundElements.join(', ')} sounds.`
    : 'Custom sound mix.';

  return {
    title: scene.name,
    description: `${scene.description} ${soundDescription}`,
    keywords: ['ambient', 'soundscape', 'relaxation', 'focus', ...soundElements],
    openGraph: {
      title: scene.name,
      description: scene.description,
      type: 'website',
    },
  };
}

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
