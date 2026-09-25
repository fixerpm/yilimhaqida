/**
 * 2010 — Celebration Mini Website
 * Lightweight, zero-dependency canvas confetti celebration.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  const card = document.getElementById('celebrate-card');

  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;
  let particles = [];
  let animationId = null;

  // Festive, sophisticated color palette
  const colors = [
    '#f43f5e', // Rose
    '#ec4899', // Pink
    '#8b5cf6', // Violet
    '#3b82f6', // Blue
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#fbbf24', // Gold
  ];

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  resize();

  class ConfettiParticle {
    constructor(x, y, isBurst = false) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      
      const angle = Math.random() * Math.PI * 2;
      const speed = isBurst ? Math.random() * 8 + 4 : Math.random() * 6 + 2;

      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (isBurst ? 5 : 2); // initial upward boost
      this.gravity = 0.18;
      this.drag = 0.96;
      
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 8;
      this.wobble = Math.random() * 10;
      this.wobbleSpeed = Math.random() * 0.1;

      this.alpha = 1;
      this.decay = Math.random() * 0.008 + 0.005;
      this.shape = Math.random() > 0.4 ? 'rect' : 'circle';
    }

    update() {
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.vy += this.gravity;

      this.x += this.vx;
      this.y += this.vy;

      this.rotation += this.rotationSpeed;
      this.wobble += this.wobbleSpeed;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;

      const scaleX = Math.cos(this.wobble);

      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2 * scaleX, -this.size / 2, this.size * scaleX, this.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, (this.size / 2.5) * Math.abs(scaleX), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function launchConfetti(x, y, count = 70, isBurst = true) {
    for (let i = 0; i < count; i++) {
      particles.push(new ConfettiParticle(x, y, isBurst));
    }
    if (!animationId) {
      loop();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);

      if (p.alpha <= 0 || p.y > height + 20) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animationId = requestAnimationFrame(loop);
    } else {
      animationId = null;
    }
  }

  // Initial gentle celebration on page load
  window.addEventListener('DOMContentLoaded', () => {
    // Center point
    setTimeout(() => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      launchConfetti(centerX, centerY - 30, 85, true);
    }, 400);

    // Subtle second wave from bottom corners
    setTimeout(() => {
      launchConfetti(window.innerWidth * 0.35, window.innerHeight * 0.65, 40, true);
      launchConfetti(window.innerWidth * 0.65, window.innerHeight * 0.65, 40, true);
    }, 850);
  });

  // Tap or click anywhere to trigger confetti
  window.addEventListener('pointerdown', (e) => {
    // Small celebratory burst at touch / click coordinates
    launchConfetti(e.clientX, e.clientY, 45, true);
  });
})();
