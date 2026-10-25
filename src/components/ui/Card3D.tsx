import React, { useRef, useState, useCallback } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple' | 'none';
  onClick?: () => void;
  depth?: number;
  maxTilt?: number;
  interactive?: boolean;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  glowColor = 'indigo',
  onClick,
  depth = 20,
  maxTilt = 8,
  interactive = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  }, [interactive, maxTilt]);

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const getGlowStyles = () => {
    switch (glowColor) {
      case 'emerald':
        return 'hover:border-emerald-500/50 hover:shadow-emerald-500/20';
      case 'amber':
        return 'hover:border-amber-500/50 hover:shadow-amber-500/20';
      case 'rose':
        return 'hover:border-rose-500/50 hover:shadow-rose-500/20';
      case 'cyan':
        return 'hover:border-cyan-500/50 hover:shadow-cyan-500/20';
      case 'purple':
        return 'hover:border-purple-500/50 hover:shadow-purple-500/20';
      case 'indigo':
        return 'hover:border-indigo-500/50 hover:shadow-indigo-500/20';
      default:
        return 'hover:border-slate-700/80 hover:shadow-black/60';
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 select-none ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`relative rounded-2xl bg-gradient-to-br from-[#0E1526]/95 via-[#0A0F1D]/90 to-[#070B14]/95 border border-slate-800/90 shadow-xl overflow-hidden transition-all duration-200 ease-out preserve-3d ${getGlowStyles()} ${className}`}
        style={{
          transform: isHovered
            ? `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${depth}px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 30px rgba(99, 102, 241, 0.15)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Specular Light Glare Overlay */}
        {interactive && isHovered && (
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 opacity-60"
            style={{
              background: `radial-gradient(circle 250px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.12), transparent 80%)`
            }}
          />
        )}

        {/* Ambient Corner Accent Glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Content with 3D Pop */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
