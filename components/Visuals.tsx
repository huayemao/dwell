'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

import { SCENES } from '@/lib/config';
import { visualEffects } from '@/lib/visualEffects';

export function Visuals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentSceneId = useAppStore(state => state.currentScene);
  const isPlaying = useAppStore(state => state.isPlaying);
  const isEntered = useAppStore(state => state.isEntered);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentScene = SCENES.find(s => s.id === currentSceneId);
  const visualVariant = currentScene?.visual.variant || 'custom';
  const videoUrl = currentScene?.visual.videoUrl;
  const isVideoType = currentScene?.visual.type === 'video';

  const shouldAnimate = !isEntered || isPlaying;

  useEffect(() => {
    if (videoRef.current && videoUrl && isVideoType) {
      if (videoRef.current.src !== videoUrl) {
        videoRef.current.src = videoUrl;
      }
      if (shouldAnimate) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [videoUrl, shouldAnimate, isVideoType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const effect = visualEffects[visualVariant] || visualEffects.custom;

    const initParticles = () => {
      particles = [];
      effect.init(canvas, particles);
    };

    let time = 0;

    const draw = () => {
      if (!shouldAnimate) {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        animationId = requestAnimationFrame(draw);
        return;
      }

      time += 0.01;

      effect.draw(ctx, canvas, particles, time);

      animationId = requestAnimationFrame(draw);
    };

    initParticles();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [visualVariant, shouldAnimate]);

  return (
    <>
      {videoUrl && isVideoType && (
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          crossOrigin="anonymous"
          className="fixed inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 opacity-100"
        />
      )}
      <canvas 
        ref={canvasRef} 
        className={`fixed inset-0 w-full h-full pointer-events-none z-0 transition-all duration-1000 ${
          visualVariant === 'fireplace' ? 'opacity-50 mix-blend-screen' : 'opacity-100 mix-blend-normal'
        }`}
      />
    </>
  );
}
