"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 12, // Slower, more majestic rotation
  delay = 0,
  // UPDATED DEFAULTS: Cyan to Gold (The "Halo" colors)
  colorFrom = "#fcd34d", // Gold
  colorTo = "#22d3ee",   // Cyan
}: BorderBeamProps) {
  const beamRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!beamRef.current) return;

    gsap.to(beamRef.current, {
      rotation: 360,
      duration: duration,
      repeat: -1,
      ease: "none",
      delay: delay,
    });
  }, { scope: beamRef });

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(1px)_solid_transparent]",
        "[mask-clip:padding-box,border-box]",
        "[mask-composite:intersect]",
        "[mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
        className
      )}
    >
      <div
        ref={beamRef}
        className="absolute aspect-square"
        style={{
            width: size,
            left: "50%",
            top: "50%",
            translate: "-50% -50%",
            background: `conic-gradient(from 0deg, transparent 0 300deg, ${colorTo} 320deg, ${colorFrom} 360deg)`,
            opacity: 0.7,
            filter: "blur(15px)", // Extra glow for that "ethereal" look
        }}
      />
    </div>
  );
}
