/* QCV Notification Sounds — Professional Web Audio API */
(function() {
    let audioCtx = null;
    let unlocked = false;

    function getCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    function unlock() {
        if (unlocked) return;
        unlocked = true;
        try {
            const ctx = getCtx();
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1, ctx.currentTime);
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.01);
        } catch(e) {}
    }

    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });

    function playNote(freq, duration, type, volume, delay) {
        try {
            const ctx = getCtx();
            const t = ctx.currentTime + (delay || 0);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(volume || 0.15, t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + duration);
        } catch(e) {}
    }

    function playChord(freqs, duration, type, volume, delay) {
        freqs.forEach(function(f) { playNote(f, duration, type, volume, delay); });
    }

    window.QCVNotify = {
        success: function() {
            // Professional ascending major chord: C5 → E5 → G5 → C6
            playNote(523.25, 0.18, 'sine', 0.12, 0);
            playNote(659.25, 0.18, 'sine', 0.10, 0.06);
            playNote(783.99, 0.18, 'sine', 0.08, 0.12);
            playNote(1046.50, 0.25, 'sine', 0.10, 0.18);
            // Soft shimmer
            playNote(1318.51, 0.3, 'sine', 0.04, 0.22);
        },
        error: function() {
            // Professional descending minor: E4 → C4
            playNote(329.63, 0.15, 'triangle', 0.12, 0);
            playNote(261.63, 0.25, 'triangle', 0.10, 0.1);
            // Sub bass thud
            playNote(80, 0.15, 'sine', 0.08, 0);
        },
        notify: function() {
            // Clean double tap: G5 → B5
            playNote(783.99, 0.1, 'sine', 0.10, 0);
            playNote(987.77, 0.15, 'sine', 0.08, 0.08);
        },
        click: function() {
            // Subtle soft click
            playNote(800, 0.03, 'sine', 0.06, 0);
            playNote(600, 0.02, 'sine', 0.04, 0.01);
        },
        save: function() {
            // Professional ascending: C5 → E5 → G5
            playNote(523.25, 0.12, 'sine', 0.10, 0);
            playNote(659.25, 0.12, 'sine', 0.08, 0.08);
            playNote(783.99, 0.18, 'sine', 0.09, 0.16);
        },
        download: function() {
            // Triumphant ascending: G4 → C5 → E5 → G5
            playNote(392.00, 0.1, 'sine', 0.08, 0);
            playNote(523.25, 0.1, 'sine', 0.09, 0.08);
            playNote(659.25, 0.1, 'sine', 0.08, 0.16);
            playNote(783.99, 0.12, 'sine', 0.07, 0.24);
            playNote(1046.50, 0.2, 'sine', 0.08, 0.32);
        },
        deploy: function() {
            // Grand ascending fanfare: C4 → E4 → G4 → C5 → E5 → G5
            playNote(261.63, 0.08, 'sine', 0.06, 0);
            playNote(329.63, 0.08, 'sine', 0.07, 0.06);
            playNote(392.00, 0.08, 'sine', 0.08, 0.12);
            playNote(523.25, 0.10, 'sine', 0.09, 0.18);
            playNote(659.25, 0.10, 'sine', 0.08, 0.24);
            playNote(783.99, 0.12, 'sine', 0.07, 0.30);
            playNote(1046.50, 0.25, 'sine', 0.09, 0.36);
            // Sparkle
            playNote(1318.51, 0.15, 'sine', 0.03, 0.40);
            playNote(1567.98, 0.12, 'sine', 0.02, 0.44);
        }
    };
})();
