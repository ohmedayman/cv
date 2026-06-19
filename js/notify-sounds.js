/* QCV Notification Sounds — Web Audio API */
(function() {
    let audioCtx = null;

    function getCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
    }

    function playTone(freq, duration, type, volume) {
        try {
            const ctx = getCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(volume || 0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch(e) {}
    }

    window.QCVNotify = {
        // Success sound (two-tone ascending)
        success: function() {
            playTone(523, 0.12, 'sine', 0.12);
            setTimeout(function() { playTone(659, 0.12, 'sine', 0.12); }, 100);
            setTimeout(function() { playTone(784, 0.18, 'sine', 0.10); }, 200);
        },
        // Error sound (descending)
        error: function() {
            playTone(400, 0.15, 'square', 0.08);
            setTimeout(function() { playTone(300, 0.2, 'square', 0.06); }, 120);
        },
        // Notification sound (gentle ping)
        notify: function() {
            playTone(880, 0.08, 'sine', 0.10);
            setTimeout(function() { playTone(1100, 0.15, 'sine', 0.08); }, 80);
        },
        // Click sound (subtle)
        click: function() {
            playTone(600, 0.05, 'sine', 0.06);
        },
        // Save sound
        save: function() {
            playTone(440, 0.08, 'sine', 0.10);
            setTimeout(function() { playTone(554, 0.08, 'sine', 0.10); }, 80);
            setTimeout(function() { playTone(659, 0.12, 'sine', 0.08); }, 160);
        },
        // Download sound
        download: function() {
            playTone(392, 0.1, 'sine', 0.10);
            setTimeout(function() { playTone(523, 0.1, 'sine', 0.10); }, 100);
            setTimeout(function() { playTone(659, 0.1, 'sine', 0.10); }, 200);
            setTimeout(function() { playTone(784, 0.15, 'sine', 0.08); }, 300);
        }
    };
})();
