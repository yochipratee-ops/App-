// Web Audio API ambient soothing synthesizer for audio player and peaceful chime
class SoothingAudioPlayer {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  public isPlaying: boolean = false;
  private timer: number | null = null;
  private elapsedSeconds: number = 84; // initial 1:24
  private onTimeUpdate?: (seconds: number) => void;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(onUpdate?: (sec: number) => void) {
    try {
      this.initContext();
      if (!this.ctx) return;
      this.onTimeUpdate = onUpdate;

      // Master gain
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      // Create peaceful harmonic chord (432Hz harmonic series: calming D / F# / A)
      const freqs = [216, 270, 324, 432];
      this.oscillators = freqs.map((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const subGain = this.ctx!.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
        subGain.gain.setValueAtTime(0.2 / (idx + 1), this.ctx!.currentTime);
        osc.connect(subGain);
        subGain.connect(this.gainNode!);
        osc.start();
        return osc;
      });

      this.isPlaying = true;

      // Timer ticker
      this.timer = window.setInterval(() => {
        this.elapsedSeconds = (this.elapsedSeconds + 1) % 330; // 5:30 is 330s
        if (this.onTimeUpdate) {
          this.onTimeUpdate(this.elapsedSeconds);
        }
      }, 1000);
    } catch {
      this.isPlaying = true;
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    try {
      if (this.gainNode && this.ctx) {
        this.gainNode.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.2);
      }
      setTimeout(() => {
        this.oscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch {}
        });
        this.oscillators = [];
      }, 250);
    } catch {}
  }

  public playGentleChime() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, this.ctx.currentTime); // 528Hz love/peace frequency
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch {}
  }

  public getElapsed() {
    return this.elapsedSeconds;
  }
}

export const soothingAudio = new SoothingAudioPlayer();
