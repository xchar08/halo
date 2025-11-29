"use client";

import { useEffect, useRef } from "react";

interface StarProps {
  speed?: number;
  density?: number;
}

export function StarField({ speed = 0.5, density = 200 }: StarProps) { // Increased density
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);
    resize();

    // Reference colors: Bright White, Cyan, Deep Gold
    const colors = ["#ffffff", "#a5f3fc", "#fde047"];
    
    const stars: { 
        x: number; y: number; size: number; color: string; 
        alpha: number; speed: number; glow: boolean 
    }[] = [];

    for (let i = 0; i < density; i++) {
      const isBig = Math.random() > 0.98; // 2% chance of being a "hero" star
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isBig ? Math.random() * 2 + 1.5 : Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random(),
        speed: (Math.random() * speed + 0.05) * (isBig ? 1.5 : 0.5), // Parallax
        glow: isBig
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw background gradient
      const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
      grad.addColorStop(0, "rgba(10, 20, 40, 0)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        star.y -= star.speed;
        
        if (star.y < -10) {
          star.y = height + 10;
          star.x = Math.random() * width;
        }

        // Twinkle logic
        const twinkle = Math.abs(Math.sin(Date.now() * 0.001 * star.speed * 3));
        star.alpha = 0.3 + twinkle * 0.7;

        ctx.beginPath();
        ctx.fillStyle = star.color;
        
        // Draw Glow for hero stars
        if (star.glow) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = star.color;
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = star.alpha;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(render);
    };

    const animation = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animation);
    };
  }, [density, speed]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none mix-blend-screen"
      style={{ background: "transparent" }}
    />
  );
}
