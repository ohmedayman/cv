/* QCV Notification Sounds — Web Audio API */
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

    function playTone(freq, duration, type, volume) {
        try {
            const ctx = getCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(volume || 0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch(e) {}
    }

    window.QCVNotify = {
        success: function() {
            playTone(523, 0.1, 'sine', 0.25);
            setTimeout(function() { playTone(659, 0.1, 'sine', 0.25); }, 80);
            setTimeout(function() { playTone(784, 0.15, 'sine', 0.2); }, 160);
        },
        error: function() {
            playTone(400, 0.12, 'square', 0.15);
            setTimeout(function() { playTone(300, 0.18, 'square', 0.12); }, 100);
        },
        notify: function() {
            playTone(880, 0.08, 'sine', 0.2);
            setTimeout(function() { playTone(1100, 0.12, 'sine', 0.18); }, 70);
        },
        click: function() {
            playTone(600, 0.04, 'sine', 0.12);
        },
        save: function() {
            playTone(440, 0.07, 'sine', 0.2);
            setTimeout(function() { playTone(554, 0.07, 'sine', 0.2); }, 70);
            setTimeout(function() { playTone(659, 0.1, 'sine', 0.18); }, 140);
        },
        download: function() {
            playTone(392, 0.08, 'sine', 0.2);
            setTimeout(function() { playTone(523, 0.08, 'sine', 0.2); }, 80);
            setTimeout(function() { playTone(659, 0.08, 'sine', 0.2); }, 160);
            setTimeout(function() { playTone(784, 0.12, 'sine', 0.18); }, 240);
        },
        deploy: function() {
            playTone(523, 0.08, 'sine', 0.25);
            setTimeout(function() { playTone(659, 0.08, 'sine', 0.25); }, 80);
            setTimeout(function() { playTone(784, 0.08, 'sine', 0.25); }, 160);
            setTimeout(function() { playTone(1047, 0.2, 'sine', 0.2); }, 240);
        }
    };
})();
