// Synthesizes a reverent bronze monastery bell chime using the Web Audio API
export function playMonasteryBellChime(strokes = 3) {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const baseFreq = 528; // Resonant C5 / Solfeggio bell tone

    for (let i = 0; i < strokes; i++) {
      const startTime = ctx.currentTime + i * 0.75;

      // Fundamental and harmonic partials of a bronze church bell
      const partials = [
        { ratio: 1.0, gain: 0.28, decay: 2.2 },
        { ratio: 2.0, gain: 0.14, decay: 1.6 },
        { ratio: 2.4, gain: 0.09, decay: 1.2 },
        { ratio: 3.0, gain: 0.06, decay: 0.9 },
      ];

      partials.forEach((p) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * p.ratio, startTime);

        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.exponentialRampToValueAtTime(p.gain, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + p.decay);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + p.decay + 0.05);
      });
    }
  } catch {
    // Ignore if browser autoplay policy blocks audio prior to interaction
  }
}
