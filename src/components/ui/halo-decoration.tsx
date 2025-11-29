"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function HaloDecoration({ className }: { className?: string }) {
  // FIXED: Changed SVGGElement to SVGSVGElement to match the <svg> tag
  const starsRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".halo-star", {
        opacity: 0.2,
        scale: 0.8,
        duration: "random(1, 2)",
        repeat: -1,
        yoyo: true,
        stagger: {
          amount: 1,
          from: "random"
        }
      });
      
      gsap.to(".ring-1", { rotation: 360, transformOrigin: "50% 50%", duration: 20, repeat: -1, ease: "none" });
      gsap.to(".ring-2", { rotation: -360, transformOrigin: "50% 50%", duration: 25, repeat: -1, ease: "none" });
    }, starsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={`pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[300px] h-[150px] z-20 ${className}`}>
      <svg 
        viewBox="0 0 300 150" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full overflow-visible" 
        ref={starsRef}
      >
        <defs>
          <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <path id="star-shape" d="M0,-5 L1,-1 L5,0 L1,1 L0,5 L-1,1 L-5,0 L-1,-1 Z" fill="#FCD34D" />
        </defs>

        <g className="ring-1" style={{ filter: "url(#gold-glow)" }}>
          <ellipse cx="150" cy="75" rx="120" ry="20" stroke="url(#grad-gold)" strokeWidth="1.5" strokeOpacity="0.8" />
          <use href="#star-shape" x="270" y="75" className="halo-star" transform="scale(1.5)" />
          <use href="#star-shape" x="30" y="75" className="halo-star" transform="scale(1.2)" />
          <use href="#star-shape" x="150" y="55" className="halo-star" transform="scale(0.8)" />
        </g>

        <g className="ring-2" style={{ filter: "url(#gold-glow)" }}>
          <ellipse cx="150" cy="75" rx="120" ry="20" stroke="url(#grad-gold)" strokeWidth="1.5" strokeOpacity="0.8" transform="rotate(15 150 75)" />
           <path d="M150,60 L153,72 L165,75 L153,78 L150,90 L147,78 L135,75 L147,72 Z" fill="#FEF08A" className="halo-star" style={{ filter: "drop-shadow(0 0 5px #FCD34D)" }} />
        </g>

        <circle cx="120" cy="60" r="1" fill="#FCD34D" className="halo-star" />
        <circle cx="180" cy="90" r="1" fill="#FCD34D" className="halo-star" />
        <circle cx="140" cy="40" r="1.5" fill="#FEF3C7" className="halo-star" />
        <circle cx="160" cy="110" r="1" fill="#FEF3C7" className="halo-star" />

        <linearGradient id="grad-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FCD34D" stopOpacity="0" />
          <stop offset="50%" stopColor="#FCD34D" stopOpacity="1" />
          <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
        </linearGradient>
      </svg>
    </div>
  );
}
