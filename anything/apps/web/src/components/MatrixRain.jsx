"use client";

import { useEffect, useRef } from "react";

export default function MatrixRain({ isDark, accentColor }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationId;
    let drops = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setup = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      const fontSize = 14;
      const columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.random() * -100);
    };

    setup();

    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const charArr = chars.split("");
    const fontSize = 14;

    const draw = () => {
      // fade trail — warm dark background
      ctx.fillStyle = isDark
        ? "rgba(15, 10, 5, 0.08)"
        : "rgba(255, 251, 245, 0.12)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArr[Math.floor(Math.random() * charArr.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const isHead = Math.random() > 0.975;
        ctx.fillStyle = isHead
          ? accentColor
          : isDark
            ? "rgba(251, 146, 60, 0.35)"
            : "rgba(234, 88, 12, 0.22)";
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => setup();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, [isDark, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        opacity: isDark ? 0.35 : 0.18,
        transition: "opacity 0.6s ease",
      }}
    />
  );
}
