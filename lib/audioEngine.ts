import { SOUND_ELEMENTS, SynthType } from './config';
import { audioSynths } from './audioSynths';

export class AudioEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  nodes: Map<string, { gain: GainNode, sources: any[], stop: () => void }> = new Map();
  
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
  }

  setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
    }
  }

  stopAll() {
    this.nodes.forEach(node => {
      node.stop();
      try { node.gain.disconnect(); } catch (e) {}
    });
    this.nodes.clear();
  }

  createNoiseBuffer = (type: 'white' | 'pink' | 'brown', duration: number = 2) => {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    
    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    }
    return buffer;
  }

  playElement(id: string, synthType: SynthType, volume: number) {
    if (!this.ctx || !this.masterGain) return;
    if (this.nodes.has(id)) {
      this.setElementVolume(id, volume);
      return;
    }

    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    gain.connect(this.masterGain);

    const synthGenerator = audioSynths[synthType];
    if (synthGenerator) {
      const { sources, stopFn } = synthGenerator(this.ctx, gain, this.createNoiseBuffer, id);
      this.nodes.set(id, { gain, sources, stop: stopFn });
    } else {
      this.nodes.set(id, { gain, sources: [], stop: () => {} });
    }
  }

  setElementVolume(id: string, volume: number) {
    const node = this.nodes.get(id);
    if (node && this.ctx) {
      node.gain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.1);
    }
  }

  stopElement(id: string) {
    const node = this.nodes.get(id);
    if (node) {
      node.stop();
      try { node.gain.disconnect(); } catch (e) {}
      this.nodes.delete(id);
    }
  }

  syncMix(activeMix: Record<string, number>) {
    if (!this.ctx) this.init();
    if (this.ctx?.state === 'suspended') this.ctx.resume();

    // Start or update elements
    for (const [id, volume] of Object.entries(activeMix)) {
      const def = SOUND_ELEMENTS.find(e => e.id === id);
      if (def) {
        if (this.nodes.has(id)) {
          this.setElementVolume(id, volume);
        } else {
          this.playElement(id, def.synthType, volume);
        }
      }
    }

    // Stop elements not in mix
    for (const id of this.nodes.keys()) {
      if (!(id in activeMix)) {
        this.stopElement(id);
      }
    }
  }
}

export const audio = new AudioEngine();
