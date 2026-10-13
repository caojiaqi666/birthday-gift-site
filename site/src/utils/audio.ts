/**
 * Web Audio API synthesizer for romantic birthday effects & ambient melody.
 * Works natively in all modern browsers without external audio assets.
 */

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private isBgmPlaying = false;
  private bgmTimer: number | null = null;
  private masterGain: GainNode | null = null;
  private customAudio: HTMLAudioElement | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play realistic balloon pop sound
  playPop() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      // Add noise burst for crisp pop
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.6, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);
      noise.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      osc.start(now);
      noise.start(now);
      osc.stop(now + 0.1);
      noise.stop(now + 0.06);
    } catch {
      // Audio fallback silent
    }
  }

  // Play sparkle / chime sound for reveals and blooms
  playSparkle() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

      notes.forEach((freq, index) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.05);

        gain.gain.setValueAtTime(0, now + index * 0.05);
        gain.gain.linearRampToValueAtTime(0.25, now + index * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.05 + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + index * 0.05);
        osc.stop(now + index * 0.05 + 0.45);
      });
    } catch {
      // Audio fallback silent
    }
  }

  // Play candle blowout whoosh + magic chime
  playBlow() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      // White noise for air blowing
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.3;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(300, now + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.7, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + 0.45);

      setTimeout(() => {
        this.playCelebrationFanfare();
      }, 350);
    } catch {
      // fallback
    }
  }

  // Celebratory birthday arpeggio / fanfare
  playCelebrationFanfare() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      // Birthday motif: C4, C4, D4, C4, F4, E4
      const chords = [
        { freq: 261.63, time: 0.0, dur: 0.2 },
        { freq: 261.63, time: 0.2, dur: 0.2 },
        { freq: 293.66, time: 0.4, dur: 0.35 },
        { freq: 261.63, time: 0.8, dur: 0.35 },
        { freq: 349.23, time: 1.2, dur: 0.4 },
        { freq: 329.63, time: 1.6, dur: 0.7 },
      ];

      chords.forEach(({ freq, time, dur }) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.3, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + time);
        osc.stop(now + time + dur + 0.05);
      });
    } catch {
      // fallback
    }
  }

  // Play romantic gift unwrap chime
  playUnwrap() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const freqs = [392, 523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.3, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.5);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.55);
      });
    } catch {
      // fallback
    }
  }

  // Play soft paper rustle for opening envelope
  playLetterOpen() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      this.playSparkle();
    } catch {
      // fallback
    }
  }

  // Play button click tap
  playClick() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // fallback
    }
  }

  // Soft cinematic swell used when the floral curtain first opens.
  playOpening() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(174.61, now);
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 1.35);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, now);
      filter.frequency.exponentialRampToValueAtTime(2600, now + 1.35);
      gain.gain.setValueAtTime(.001, now);
      gain.gain.exponentialRampToValueAtTime(.16, now + .42);
      gain.gain.exponentialRampToValueAtTime(.001, now + 1.55);
      osc.connect(filter); filter.connect(gain); gain.connect(this.masterGain);
      osc.start(now); osc.stop(now + 1.6);
      window.setTimeout(() => this.playSparkle(), 760);
    } catch { /* silent fallback */ }
  }

  // Long filtered whoosh that follows the cupid arrow across the screen.
  playArrowFlight() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const length = Math.floor(this.ctx.sampleRate * 2.25);
      const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length * .35);
      const source = this.ctx.createBufferSource();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      const pan = this.ctx.createStereoPanner();
      source.buffer = buffer;
      filter.type = 'bandpass'; filter.Q.value = 1.2;
      filter.frequency.setValueAtTime(420, now);
      filter.frequency.exponentialRampToValueAtTime(1850, now + 1.05);
      filter.frequency.exponentialRampToValueAtTime(720, now + 2.2);
      pan.pan.setValueAtTime(-.75, now); pan.pan.linearRampToValueAtTime(.8, now + 1.05); pan.pan.linearRampToValueAtTime(0, now + 2.2);
      gain.gain.setValueAtTime(.001, now); gain.gain.linearRampToValueAtTime(.16, now + .18); gain.gain.setValueAtTime(.12, now + 1.65); gain.gain.exponentialRampToValueAtTime(.001, now + 2.25);
      source.connect(filter); filter.connect(pan); pan.connect(gain); gain.connect(this.masterGain);
      source.start(now); source.stop(now + 2.26);
      [0, .58, 1.16, 1.7].forEach((offset, index) => {
        if (!this.ctx || !this.masterGain) return;
        const ping = this.ctx.createOscillator(); const pingGain = this.ctx.createGain();
        ping.type = 'sine'; ping.frequency.value = 880 + index * 110;
        pingGain.gain.setValueAtTime(.001, now + offset); pingGain.gain.linearRampToValueAtTime(.055, now + offset + .02); pingGain.gain.exponentialRampToValueAtTime(.001, now + offset + .22);
        ping.connect(pingGain); pingGain.connect(this.masterGain); ping.start(now + offset); ping.stop(now + offset + .24);
      });
    } catch { /* silent fallback */ }
  }

  playHeartImpact() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      // A tiny airy "kiss" followed by a high glass shimmer — no percussive thud.
      const length = Math.floor(this.ctx.sampleRate * .18);
      const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / length);
      const air = this.ctx.createBufferSource(); const filter = this.ctx.createBiquadFilter(); const airGain = this.ctx.createGain();
      air.buffer = buffer; filter.type = 'highpass'; filter.frequency.value = 2400;
      airGain.gain.setValueAtTime(.07, now); airGain.gain.exponentialRampToValueAtTime(.001, now + .2);
      air.connect(filter); filter.connect(airGain); airGain.connect(this.masterGain); air.start(now); air.stop(now + .2);
      [1046.5, 1318.51, 1567.98].forEach((freq, index) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(.001, now + index * .055); gain.gain.linearRampToValueAtTime(.065, now + index * .055 + .018); gain.gain.exponentialRampToValueAtTime(.001, now + .72);
        osc.connect(gain); gain.connect(this.masterGain); osc.start(now + index * .055); osc.stop(now + .74);
      });
    } catch { /* silent fallback */ }
  }

  playTransition() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      const length = Math.floor(this.ctx.sampleRate * .58);
      const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);

      const breeze = this.ctx.createBufferSource();
      const breezeFilter = this.ctx.createBiquadFilter();
      const breezeGain = this.ctx.createGain();
      breeze.buffer = buffer;
      breezeFilter.type = 'lowpass';
      breezeFilter.frequency.setValueAtTime(620, now);
      breezeFilter.frequency.exponentialRampToValueAtTime(1350, now + .3);
      breezeGain.gain.setValueAtTime(.001, now);
      breezeGain.gain.linearRampToValueAtTime(.032, now + .12);
      breezeGain.gain.exponentialRampToValueAtTime(.001, now + .56);
      breeze.connect(breezeFilter); breezeFilter.connect(breezeGain); breezeGain.connect(this.masterGain);
      breeze.start(now); breeze.stop(now + .58);

    } catch { /* silent fallback */ }
  }

  playFireworks() {
    // One cohesive celebration flourish; the final balloon already supplied its pop.
    this.playCelebrationFanfare();
    window.setTimeout(() => this.playSparkle(), 180);
  }

  // Bright romantic birthday theme: warm major chords with a light harp-like melody.
  private playRomanticMelodyStep(step: number) {
    if (!this.isBgmPlaying || !this.ctx || !this.masterGain) return;

    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [196.00, 246.94, 329.63, 392.00], // G6
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 261.63, 293.66, 392.00], // Gsus(add6)
    ];
    const topLine = [659.25, 783.99, 880.00, 783.99, 698.46, 783.99, 659.25, 587.33];
    const chord = chords[step % chords.length];
    const now = this.ctx.currentTime;
    chord.forEach((freq, noteIdx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(.001, now); gain.gain.linearRampToValueAtTime(.022, now + .38); gain.gain.setValueAtTime(.019, now + 2.05); gain.gain.exponentialRampToValueAtTime(.001, now + 2.72);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now); osc.stop(now + 2.76);
    });
    [0, .38, .78].forEach((offset, index) => {
      if (!this.ctx || !this.masterGain) return;
      const bell = this.ctx.createOscillator(); const bellGain = this.ctx.createGain();
      bell.type = 'sine'; bell.frequency.value = topLine[(step * 2 + index) % topLine.length];
      bellGain.gain.setValueAtTime(.001, now + offset); bellGain.gain.linearRampToValueAtTime(.026, now + offset + .025); bellGain.gain.exponentialRampToValueAtTime(.001, now + offset + .68);
      bell.connect(bellGain); bellGain.connect(this.masterGain); bell.start(now + offset); bell.stop(now + offset + .72);
    });
    this.bgmTimer = window.setTimeout(() => {
      this.playRomanticMelodyStep(step + 1);
    }, 2550);
  }

  // 后台上传的背景音乐:有就循环播放它,否则用合成旋律
  setCustomBGM(src: string, volume = 0.6) {
    if (!src) { this.customAudio = null; return; }
    if (this.customAudio && this.customAudio.src.endsWith(src.replace(/^\.\//, ''))) return;
    const a = new Audio(src); a.loop = true; a.preload = 'auto'; a.volume = Math.max(0, Math.min(1, volume));
    this.customAudio = a;
  }

  toggleBGM(force?: boolean): boolean {
    this.initContext();
    const targetState = force !== undefined ? force : !this.isBgmPlaying;

    if (targetState) {
      this.isBgmPlaying = true;
      // Also try to play html5 audio if available
      if (this.customAudio) {
        this.customAudio.play().catch(() => {
          this.playRomanticMelodyStep(0);
        });
      } else {
        this.playRomanticMelodyStep(0);
      }
    } else {
      this.isBgmPlaying = false;
      if (this.bgmTimer) {
        clearTimeout(this.bgmTimer);
        this.bgmTimer = null;
      }
      if (this.customAudio) {
        this.customAudio.pause();
      }
    }

    return this.isBgmPlaying;
  }

  isMusicPlaying(): boolean {
    return this.isBgmPlaying;
  }
}

export const sound = new SoundEffectsEngine();
