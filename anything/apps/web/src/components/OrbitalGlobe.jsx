"use client";

import { useEffect, useRef } from "react";

// Animated orbital lines + glowing dots inspired by Apero hero section.
// Renders a curved "earth arc" with city points that twinkle and connect.
export default function OrbitalGlobe({
  accentColor = "#FB923C",
  isDark = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let raf;
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Earth center is below the canvas → only top arc is visible
    const cx = () => w / 2;
    const cy = () => h * 2.2;
    const radius = () => h * 2;

    // Define city points by angle (radians) along the arc, with a "weight"
    // representing how bright they pulse.
    const cities = [
      { angle: -1.25, label: "NYC", phase: Math.random() * Math.PI * 2 },
      { angle: -1.05, label: "LON", phase: Math.random() * Math.PI * 2 },
      { angle: -0.92, label: "PAR", phase: Math.random() * Math.PI * 2 },
      { angle: -0.75, label: "DXB", phase: Math.random() * Math.PI * 2 },
      { angle: -0.58, label: "MUM", phase: Math.random() * Math.PI * 2 },
      { angle: -0.4, label: "BKK", phase: Math.random() * Math.PI * 2 },
      { angle: -0.22, label: "HKG", phase: Math.random() * Math.PI * 2 },
      { angle: -0.05, label: "TYO", phase: Math.random() * Math.PI * 2 },
      { angle: 0.15, label: "SYD", phase: Math.random() * Math.PI * 2 },
      { angle: 0.32, label: "AKL", phase: Math.random() * Math.PI * 2 },
    ];

    // Pre-pick a few city pairs that will have an animated "connection arc"
    const connections = [
      [0, 4],
      [1, 7],
      [2, 8],
      [3, 6],
      [5, 9],
    ].map((pair) => ({
      from: pair[0],
      to: pair[1],
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.003,
    }));

    let t = 0;

    const draw = () => {
      t += 0.012;
      ctx.clearRect(0, 0, w, h);

      const earthCx = cx();
      const earthCy = cy();
      const earthR = radius();

      // Background arcs (multiple concentric rings, fading)
      for (let i = 0; i < 4; i++) {
        const r = earthR - i * 14;
        ctx.beginPath();
        ctx.arc(earthCx, earthCy, r, Math.PI, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(251,146,60,${0.08 - i * 0.015})`
          : `rgba(234,88,12,${0.06 - i * 0.012})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Vertical meridian lines from earth surface upward
      for (let i = 0; i < 18; i++) {
        const a = Math.PI + (i / 17) * Math.PI;
        const x1 = earthCx + Math.cos(a) * earthR;
        const y1 = earthCy + Math.sin(a) * earthR;
        const len = 30 + Math.sin(t + i) * 8;
        const x2 = earthCx + Math.cos(a) * (earthR - len);
        const y2 = earthCy + Math.sin(a) * (earthR - len);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(
          0,
          isDark ? "rgba(251,146,60,0.4)" : "rgba(234,88,12,0.3)",
        );
        grad.addColorStop(1, "rgba(251,146,60,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw animated arc connections between city pairs (Apero-style curves)
      connections.forEach((conn) => {
        conn.progress += conn.speed;
        if (conn.progress > 1.3) conn.progress = -0.15;

        const a1 = Math.PI + Math.PI / 2 + cities[conn.from].angle;
        const a2 = Math.PI + Math.PI / 2 + cities[conn.to].angle;
        const x1 = earthCx + Math.cos(a1) * earthR;
        const y1 = earthCy + Math.sin(a1) * earthR;
        const x2 = earthCx + Math.cos(a2) * earthR;
        const y2 = earthCy + Math.sin(a2) * earthR;

        // Control point: lifted above midpoint to make arc
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const liftMag = Math.hypot(x2 - x1, y2 - y1) * 0.35;
        const dirX = (midX - earthCx) / earthR;
        const dirY = (midY - earthCy) / earthR;
        const ctrlX = midX + dirX * -liftMag;
        const ctrlY = midY + dirY * -liftMag;

        // Faint full arc
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
        ctx.strokeStyle = isDark
          ? "rgba(251,146,60,0.12)"
          : "rgba(234,88,12,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Moving bright dot along the arc
        if (conn.progress >= 0 && conn.progress <= 1) {
          const p = conn.progress;
          const oneMinusP = 1 - p;
          const bx =
            oneMinusP * oneMinusP * x1 + 2 * oneMinusP * p * ctrlX + p * p * x2;
          const by =
            oneMinusP * oneMinusP * y1 + 2 * oneMinusP * p * ctrlY + p * p * y2;

          // Glow halo
          const halo = ctx.createRadialGradient(bx, by, 0, bx, by, 18);
          halo.addColorStop(0, accentColor);
          halo.addColorStop(0.4, `${accentColor}66`);
          halo.addColorStop(1, "rgba(251,146,60,0)");
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(bx, by, 18, 0, Math.PI * 2);
          ctx.fill();

          // Core dot
          ctx.fillStyle = "#FFE9C7";
          ctx.beginPath();
          ctx.arc(bx, by, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw cities (pulsing dots on the arc)
      cities.forEach((city) => {
        const ang = Math.PI + Math.PI / 2 + city.angle;
        const px = earthCx + Math.cos(ang) * earthR;
        const py = earthCy + Math.sin(ang) * earthR;
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + city.phase);

        const haloR = 14 + pulse * 8;
        const halo = ctx.createRadialGradient(px, py, 0, px, py, haloR);
        halo.addColorStop(
          0,
          `${accentColor}${Math.floor(40 + pulse * 60)
            .toString(16)
            .padStart(2, "0")}`,
        );
        halo.addColorStop(1, "rgba(251,146,60,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(px, py, haloR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(px, py, 2 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Tiny inner white core
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle vignette top → fade content to merge with bg
      const fade = ctx.createLinearGradient(0, 0, 0, h);
      fade.addColorStop(
        0,
        isDark ? "rgba(15,10,5,0.6)" : "rgba(255,251,245,0.6)",
      );
      fade.addColorStop(0.6, "rgba(15,10,5,0)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [accentColor, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: isDark ? 0.95 : 0.6 }}
    />
  );
}
