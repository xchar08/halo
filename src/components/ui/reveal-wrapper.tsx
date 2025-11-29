"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function RevealWrapper({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Select all direct children
    const elements = containerRef.current?.children;
    
    if (elements) {
      gsap.fromTo(
        elements,
        { 
          y: 20, 
          opacity: 0, 
          filter: "blur(4px)" 
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay,
        }
      );
    }
  }, { scope: containerRef });

  return <div ref={containerRef}>{children}</div>;
}
