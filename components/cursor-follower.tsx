// app/components/cursor-follower.tsx

"use client"

import { useState, useEffect, useRef } from "react"

interface CursorFollowerProps {
  interactiveSelectors?: string[];
}

export const CursorFollower: React.FC<CursorFollowerProps> = ({
  interactiveSelectors = ["a", "button", ".group", ".hover\\:scale-105", ".Card"]
}) => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Logika Pergerakan Mouse
    const handleMouseMove = (event: MouseEvent) => {
      setCursorPos({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    
    // 2. Logika Interaksi Hover
    const handleMouseEnter = () => {
      cursorRef.current?.classList.add("interactive-hover");
    };
    const handleMouseLeave = () => {
      cursorRef.current?.classList.remove("interactive-hover");
    };

    const selectorString = interactiveSelectors.join(', ');
    const interactiveTargets = document.querySelectorAll(selectorString);

    interactiveTargets.forEach(target => {
      target.addEventListener("mouseenter", handleMouseEnter as EventListener);
      target.addEventListener("mouseleave", handleMouseLeave as EventListener);
    });

    // Cleanup Function
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      
      interactiveTargets.forEach(target => {
        target.removeEventListener("mouseenter", handleMouseEnter as EventListener);
        target.removeEventListener("mouseleave", handleMouseLeave as EventListener);
      });
    }
  }, [interactiveSelectors]);

  return (
    <div 
      ref={cursorRef}
      className="cursor-follower hidden md:block" // hidden md:block menyembunyikannya di mobile
      style={{ 
        transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
      }}
    />
  );
}