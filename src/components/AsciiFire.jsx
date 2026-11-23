import React, { useEffect, useRef } from 'react';

export default function AsciiFire() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId = null;
    let isVisible = true;
    let lastTime = 0;
    const FPS = 28;
    const frameInterval = 1000 / FPS;

    // Character set ordered from lowest to highest heat intensity (matching the user's screenshot)
    const CHAR_PALETTE = [' ', '.', ':', '-', '=', '+', '*', '#'];

    // Color gradient for flame intensity levels
    const COLOR_PALETTE = [
      'transparent',
      '#2a0501', // . faint maroon
      '#520a02', // : dark red
      '#7a1004', // - crimson
      '#a81b07', // = medium red
      '#d62e0a', // + vibrant red-orange
      '#ff5722', // * bright orange
      '#ff8a50', // # hot amber / fire base
    ];

    // Particle character options
    const PARTICLE_CHARS = ['*', '.', '\'', ',', '+', '^'];
    const PARTICLE_COLORS = ['#ffffff', '#fff8e1', '#ffe082', '#ffb74d', '#ff8a65'];

    let width = 0;
    let height = 260;
    const charWidth = 8.2;
    const charHeight = 14;
    let cols = 0;
    let rows = 0;

    let heatMap = new Float32Array(0);
    const particles = [];

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      if (width <= 0) return;

      canvas.width = width;
      canvas.height = height;

      cols = Math.floor(width / charWidth);
      rows = Math.floor(height / charHeight);

      heatMap = new Float32Array(cols * rows);
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Pause animation when scrolled away from viewport
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Seed bottom row with turbulent fire
    const seedFire = () => {
      if (cols === 0 || rows === 0) return;
      const bottomRowIndex = (rows - 1) * cols;
      const secondBottomIndex = (rows - 2) * cols;

      for (let x = 0; x < cols; x++) {
        // Base heat variance to create peaks and valleys of flame
        const variance = Math.sin(x * 0.18 + Date.now() * 0.004) * 30;
        const randomSpike = Math.random() > 0.82 ? 55 : 0;
        const heat = Math.min(255, Math.max(160, 205 + variance + randomSpike + (Math.random() * 50 - 25)));
        heatMap[bottomRowIndex + x] = heat;
        heatMap[secondBottomIndex + x] = heat * 0.95;
      }

      // Periodically spawn floating ember particles above flame crests
      if (Math.random() > 0.35 && particles.length < 45) {
        const spawnX = Math.floor(Math.random() * cols);
        // Find approximate flame top at this column
        let flameTop = rows - 4;
        for (let y = 0; y < rows; y++) {
          if (heatMap[y * cols + spawnX] > 70) {
            flameTop = y;
            break;
          }
        }

        particles.push({
          x: spawnX,
          y: Math.max(2, flameTop - Math.random() * 4),
          vx: (Math.random() - 0.5) * 0.35,
          vy: -(0.35 + Math.random() * 0.65),
          char: PARTICLE_CHARS[Math.floor(Math.random() * PARTICLE_CHARS.length)],
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          life: 40 + Math.floor(Math.random() * 60),
          maxLife: 100,
        });
      }
    };

    // Propagate heat upwards (DOOM fire algorithm adaptation)
    const updateFire = () => {
      for (let y = 1; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const fromIdx = y * cols + x;
          const currentHeat = heatMap[fromIdx];

          if (currentHeat === 0) {
            const dstIdx = (y - 1) * cols + x;
            heatMap[dstIdx] = 0;
          } else {
            // Decay rate determines flame height
            const decay = Math.floor(Math.random() * 3);
            const spread = Math.floor(Math.random() * 3) - 1; // -1 (left), 0 (up), 1 (right)
            const dstX = (x + spread + cols) % cols;
            const dstY = y - 1;
            const dstIdx = dstY * cols + dstX;

            const newHeat = Math.max(0, currentHeat - decay * 14);
            heatMap[dstIdx] = newHeat;
          }
        }
      }

      // Update ember particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx + (Math.random() - 0.5) * 0.2;
        p.y += p.vy;
        p.life--;

        // Fade/morph particle character as it rises and expires
        if (p.life < 20) {
          p.char = '.';
        } else if (p.life < 40 && p.char === '*') {
          p.char = '+';
        }

        if (p.life <= 0 || p.y < 0 || p.x < 0 || p.x >= cols) {
          particles.splice(i, 1);
        }
      }
    };

    // Render characters to canvas
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.font = "12px 'Fira Code', ui-monospace, Menlo, Consolas, monospace";
      ctx.textBaseline = 'top';

      // 1. Draw ASCII fire cells
      for (let y = 0; y < rows; y++) {
        const rowOffset = y * cols;
        const posY = y * charHeight;

        for (let x = 0; x < cols; x++) {
          const val = heatMap[rowOffset + x];
          if (val < 15) continue; // Skip space / transparent cells

          // Map heat (0..255) to 8 levels (0..7)
          const level = Math.min(7, Math.floor((val / 255) * 8));
          if (level <= 0) continue;

          ctx.fillStyle = COLOR_PALETTE[level];
          const char = CHAR_PALETTE[level];
          ctx.fillText(char, x * charWidth, posY);
        }
      }

      // 2. Draw floating ember particles on top
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const px = Math.floor(p.x) * charWidth;
        const py = Math.floor(p.y) * charHeight;

        ctx.fillStyle = p.color;
        ctx.fillText(p.char, px, py);
      }
    };

    // Main animation loop
    const loop = (currentTime) => {
      animationFrameId = requestAnimationFrame(loop);

      if (!isVisible) return;

      const elapsed = currentTime - lastTime;
      if (elapsed > frameInterval) {
        lastTime = currentTime - (elapsed % frameInterval);
        seedFire();
        updateFire();
        render();
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="wiki-fire-container"
      aria-label="Wall of fire ASCII animation"
      role="img"
    >
      <canvas
        ref={canvasRef}
        className="wiki-fire-canvas"
      />
    </div>
  );
}

