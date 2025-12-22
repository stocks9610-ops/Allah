
import React, { useEffect, useRef, useState } from 'react';

const FLAGS = [
  '🇵🇰', '🇦🇪', '🇧🇩', '🇮🇷', '🇦🇫', '🇮🇶', '🇵🇸', '🇸🇦', '🇶🇦', '🇰🇼', 
  '🇴🇲', '🇧🇭', '🇪🇬', '🇯🇴', '🇱🇧', '🇸🇾', '🇾🇪', '🇹🇷', '🇲🇾', '🇮🇩', 
  '🇩🇿', '🇲🇦'
];

interface FlagState {
  id: number;
  emoji: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const FloatingFlags: React.FC = () => {
  const [flags, setFlags] = useState<FlagState[]>([]);
  const requestRef = useRef<number>(null);

  useEffect(() => {
    const initialFlags = FLAGS.map((emoji, i) => ({
      id: i,
      emoji,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      dx: (Math.random() - 0.5) * 1.5,
      dy: (Math.random() - 0.5) * 1.5,
    }));
    setFlags(initialFlags);

    const animate = () => {
      setFlags(prevFlags => 
        prevFlags.map(flag => {
          let nx = flag.x + flag.dx;
          let ny = flag.y + flag.dy;
          let ndx = flag.dx;
          let ndy = flag.dy;

          if (nx <= 0 || nx >= window.innerWidth - 30) ndx *= -1;
          if (ny <= 0 || ny >= window.innerHeight - 30) ndy *= -1;

          return { ...flag, x: nx, y: ny, dx: ndx, dy: ndy };
        })
      );
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      {flags.map(flag => (
        <div
          key={flag.id}
          className="absolute text-xl md:text-2xl transition-transform duration-75"
          style={{
            transform: `translate3d(${flag.x}px, ${flag.y}px, 0)`,
          }}
        >
          {flag.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingFlags;
