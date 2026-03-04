import { SynthType } from './config';

export interface SynthGenerator {
  (ctx: AudioContext, gain: GainNode, createNoiseBuffer: (type: 'white' | 'pink' | 'brown', duration?: number) => AudioBuffer | null, id: string): { sources: any[], stopFn: () => void };
}

export const audioSynths: Record<SynthType, SynthGenerator> = {
  white: (ctx, gain, createNoiseBuffer) => {
    const buffer = createNoiseBuffer('white', 5);
    if (!buffer) return { sources: [], stopFn: () => {} };
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gain);
    source.start();
    return {
      sources: [source],
      stopFn: () => { try { source.stop(); source.disconnect(); } catch (e) {} }
    };
  },
  pink: (ctx, gain, createNoiseBuffer, id) => {
    const buffer = createNoiseBuffer('pink', 5);
    if (!buffer) return { sources: [], stopFn: () => {} };
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    const sources = [];
    if (id === 'rain_heavy') {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
      source.connect(filter);
      filter.connect(gain);
      sources.push(filter);
    } else if (id === 'fire_rumble') {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      source.connect(filter);
      filter.connect(gain);
      sources.push(filter);
    } else {
      source.connect(gain);
    }
    
    source.start();
    sources.push(source);
    return {
      sources,
      stopFn: () => { try { source.stop(); source.disconnect(); } catch (e) {} }
    };
  },
  brown: (ctx, gain, createNoiseBuffer) => {
    const buffer = createNoiseBuffer('brown', 5);
    if (!buffer) return { sources: [], stopFn: () => {} };
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gain);
    source.start();
    return {
      sources: [source],
      stopFn: () => { try { source.stop(); source.disconnect(); } catch (e) {} }
    };
  },
  ocean: (ctx, gain, createNoiseBuffer) => {
    const buffer = createNoiseBuffer('pink', 10);
    if (!buffer) return { sources: [], stopFn: () => {} };
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 800;
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    source.connect(filter);
    filter.connect(gain);
    
    source.start();
    lfo.start();
    return {
      sources: [source, filter, lfo, lfoGain],
      stopFn: () => { try { source.stop(); lfo.stop(); source.disconnect(); lfo.disconnect(); filter.disconnect(); } catch (e) {} }
    };
  },
  wind: (ctx, gain, createNoiseBuffer) => {
    const buffer = createNoiseBuffer('pink', 5);
    if (!buffer) return { sources: [], stopFn: () => {} };
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.5;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05; 
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 400;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(gain);
    source.start();
    lfo.start();
    return {
      sources: [source, filter, lfo, lfoGain],
      stopFn: () => { try { source.stop(); lfo.stop(); source.disconnect(); lfo.disconnect(); filter.disconnect(); } catch (e) {} }
    };
  },
  crackle: (ctx, gain) => {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      if (Math.random() < 0.001) {
        data[i] = (Math.random() * 2 - 1) * 2;
      } else {
        data[i] = 0;
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    
    source.connect(filter);
    filter.connect(gain);
    source.start();
    return {
      sources: [source, filter],
      stopFn: () => { try { source.stop(); source.disconnect(); filter.disconnect(); } catch (e) {} }
    };
  },
  birds: (ctx, gain) => {
    let isPlaying = true;
    const chirpLoop = () => {
      if (!isPlaying || !ctx) return;
      
      const osc = ctx.createOscillator();
      const chirpGain = ctx.createGain();
      
      osc.type = 'sine';
      const freq = 3000 + Math.random() * 2000;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq - 500, ctx.currentTime + 0.1);
      
      chirpGain.gain.setValueAtTime(0, ctx.currentTime);
      chirpGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
      chirpGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
      
      osc.connect(chirpGain);
      chirpGain.connect(gain);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
      
      setTimeout(chirpLoop, 2000 + Math.random() * 5000);
    };
    chirpLoop();
    return {
      sources: [],
      stopFn: () => { isPlaying = false; }
    };
  },
  thunder: (ctx, gain, createNoiseBuffer) => {
    let isPlaying = true;
    const thunderLoop = () => {
      if (!isPlaying || !ctx) return;
      if (Math.random() < 0.3) {
        const buffer = createNoiseBuffer('brown', 3);
        if (buffer) {
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 200;
          const strikeGain = ctx.createGain();
          strikeGain.gain.setValueAtTime(0, ctx.currentTime);
          strikeGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.1);
          strikeGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3);
          source.connect(filter);
          filter.connect(strikeGain);
          strikeGain.connect(gain);
          source.start();
        }
      }
      setTimeout(thunderLoop, 5000 + Math.random() * 5000);
    };
    thunderLoop();
    return {
      sources: [],
      stopFn: () => { isPlaying = false; }
    };
  },
  river: (ctx, gain, createNoiseBuffer) => {
    const buffer = createNoiseBuffer('pink', 5);
    if (!buffer) return { sources: [], stopFn: () => {} };
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.5;
    source.connect(filter);
    filter.connect(gain);
    source.start();
    return {
      sources: [source, filter],
      stopFn: () => { try { source.stop(); source.disconnect(); filter.disconnect(); } catch(e){} }
    };
  },
  crickets: (ctx, gain) => {
    let isPlaying = true;
    const cricketLoop = () => {
      if (!isPlaying || !ctx) return;
      const osc = ctx.createOscillator();
      const chirpGain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 4500 + Math.random() * 500;
      
      const lfo = ctx.createOscillator();
      lfo.type = 'square';
      lfo.frequency.value = 15;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 1;
      lfo.connect(lfoGain);
      lfoGain.connect(chirpGain.gain);
      lfo.start();
      lfo.stop(ctx.currentTime + 0.5);

      chirpGain.gain.setValueAtTime(0, ctx.currentTime);
      chirpGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
      chirpGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      
      osc.connect(chirpGain);
      chirpGain.connect(gain);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      
      setTimeout(cricketLoop, 1000 + Math.random() * 2000);
    };
    cricketLoop();
    return {
      sources: [],
      stopFn: () => { isPlaying = false; }
    };
  },
  chimes: (ctx, gain) => {
    let isPlaying = true;
    const chimeLoop = () => {
      if (!isPlaying || !ctx) return;
      if (Math.random() < 0.5) {
        const osc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 1000 + Math.random() * 2000;
        chimeGain.gain.setValueAtTime(0, ctx.currentTime);
        chimeGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
        osc.connect(chimeGain);
        chimeGain.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 2);
      }
      setTimeout(chimeLoop, 2000 + Math.random() * 3000);
    };
    chimeLoop();
    return {
      sources: [],
      stopFn: () => { isPlaying = false; }
    };
  }
};
