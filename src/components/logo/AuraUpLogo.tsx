import { useEffect, useRef, useState } from 'react';

interface AuraUpLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  interactive?: boolean;
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { canvas: 48, text: 'text-xl', tagline: 'text-xs' },
  md: { canvas: 64, text: 'text-3xl', tagline: 'text-sm' },
  lg: { canvas: 96, text: 'text-4xl', tagline: 'text-base' },
  xl: { canvas: 128, text: 'text-5xl', tagline: 'text-lg' },
  hero: { canvas: 160, text: 'text-7xl', tagline: 'text-2xl' },
};

export default function AuraUpLogo({ 
  size = 'lg', 
  interactive = true,
  showText = true,
  showTagline = false,
  className = ''
}: AuraUpLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);
  const lightningRef = useRef<any[]>([]);
  const waveRef = useRef<number>(0);
  const config = sizeConfig[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = config.canvas * dpr;
    canvas.height = config.canvas * dpr;
    canvas.style.width = `${config.canvas}px`;
    canvas.style.height = `${config.canvas}px`;
    ctx.scale(dpr, dpr);

    const centerX = config.canvas / 2;
    const centerY = config.canvas / 2;

    // Initialize particles with multiple layers
    if (particlesRef.current.length === 0) {
      // Inner fast particles
      for (let i = 0; i < 80; i++) {
        particlesRef.current.push({
          angle: Math.random() * Math.PI * 2,
          radius: 10 + Math.random() * 15,
          speed: 0.03 + Math.random() * 0.04,
          size: 1.5 + Math.random() * 2.5,
          phase: Math.random() * Math.PI * 2,
          yOffset: (Math.random() - 0.5) * 20,
          layer: 1,
          colorShift: Math.random() * Math.PI * 2
        });
      }
      // Middle layer
      for (let i = 0; i < 60; i++) {
        particlesRef.current.push({
          angle: Math.random() * Math.PI * 2,
          radius: 25 + Math.random() * 15,
          speed: 0.015 + Math.random() * 0.025,
          size: 1 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          yOffset: (Math.random() - 0.5) * 30,
          layer: 2,
          colorShift: Math.random() * Math.PI * 2
        });
      }
      // Outer slow particles
      for (let i = 0; i < 40; i++) {
        particlesRef.current.push({
          angle: Math.random() * Math.PI * 2,
          radius: 40 + Math.random() * 20,
          speed: 0.008 + Math.random() * 0.015,
          size: 0.8 + Math.random() * 1.5,
          phase: Math.random() * Math.PI * 2,
          yOffset: (Math.random() - 0.5) * 40,
          layer: 3,
          colorShift: Math.random() * Math.PI * 2
        });
      }
    }

    let time = 0;

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, config.canvas, config.canvas);
      time += isHovered ? 0.04 : 0.025;
      waveRef.current += 0.05;

      // Draw multiple glowing layers
      for (let i = 3; i > 0; i--) {
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, (config.canvas / 2) * (i / 3));
        const pulseIntensity = Math.sin(time * 2 + i) * 0.1 + 0.2;
        gradient.addColorStop(0, `rgba(${99 + i * 20}, ${102 + i * 30}, 241, ${pulseIntensity})`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${pulseIntensity * 0.5})`);
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, config.canvas, config.canvas);
      }

      // Draw spiral energy waves
      ctx.save();
      ctx.translate(centerX, centerY);
      for (let s = 0; s < 3; s++) {
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const angle = (i / 100) * Math.PI * 4 + time * (1 + s * 0.3);
          const radius = 20 + (i / 100) * 35;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${34 + s * 50}, ${211 - s * 50}, 238, ${0.3 - s * 0.08})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(34, 211, 238, 0.5)`;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.restore();

      // Draw particles with advanced effects
      particlesRef.current.forEach((p, i) => {
        p.angle += p.speed * (isHovered ? 2 : 1);
        const wave = Math.sin(time * 3 + p.phase) * 8;
        const spiralWave = Math.sin(p.angle * 3 + time) * 3;
        const x = centerX + Math.cos(p.angle) * (p.radius + wave + spiralWave);
        const y = centerY + Math.sin(p.angle) * (p.radius + wave + spiralWave) + p.yOffset;

        const intensity = (Math.sin(time * 4 + i * 0.1 + p.colorShift) + 1) / 2;
        const hue = (time * 50 + i * 2) % 360;
        
        // Create color based on layer and position
        let r, g, b;
        if (p.layer === 1) {
          r = Math.floor(150 + intensity * 105);
          g = Math.floor(100 + intensity * 155);
          b = 255;
        } else if (p.layer === 2) {
          r = Math.floor(139 + intensity * 90);
          g = Math.floor(92 + intensity * 120);
          b = Math.floor(246);
        } else {
          r = Math.floor(99 + intensity * 80);
          g = Math.floor(102 + intensity * 100);
          b = Math.floor(241);
        }
        
        // Draw particle with glow
        const glowSize = p.size * (2 + intensity);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.9})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${0.4})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw multiple rotating rings with different speeds
      for (let r = 0; r < 4; r++) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(time * (0.3 + r * 0.2) * (r % 2 === 0 ? 1 : -1));
        ctx.beginPath();
        ctx.arc(0, 0, 30 + r * 8, 0, Math.PI * 2);
        const ringOpacity = 0.6 - r * 0.1;
        const pulseEffect = Math.sin(time * 3 + r) * 0.2 + 0.5;
        ctx.strokeStyle = isHovered 
          ? `rgba(${34 + r * 40}, 211, 238, ${ringOpacity * pulseEffect})` 
          : `rgba(6, ${182 - r * 20}, 212, ${ringOpacity * 0.7})`;
        ctx.lineWidth = 2.5 - r * 0.3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(34, 211, 238, 0.8)`;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // Draw hexagonal energy grid
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.15);
      for (let h = 0; h < 6; h++) {
        const angle = (h * Math.PI * 2) / 6;
        ctx.beginPath();
        for (let v = 0; v < 6; v++) {
          const vAngle = angle + (v * Math.PI * 2) / 6;
          const radius = 25;
          const x = Math.cos(vAngle) * radius;
          const y = Math.sin(vAngle) * radius;
          if (v === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 + Math.sin(time * 2 + h) * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Draw energy beams with lightning effect
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.7);
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        ctx.save();
        ctx.rotate(angle);
        
        // Draw main beam
        const beamGradient = ctx.createLinearGradient(0, 0, 50, 0);
        beamGradient.addColorStop(0, isHovered ? 'rgba(251, 191, 36, 0.6)' : 'rgba(34, 211, 238, 0.5)');
        beamGradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = beamGradient;
        ctx.fillRect(25, -1.5, 25, 3);
        
        // Draw lightning segments
        if (isHovered && Math.random() > 0.7) {
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.9)';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(251, 191, 36, 1)';
          ctx.beginPath();
          ctx.moveTo(30, 0);
          for (let j = 0; j < 3; j++) {
            ctx.lineTo(35 + j * 5, (Math.random() - 0.5) * 8);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
        
        ctx.restore();
      }
      ctx.restore();

      // Draw central rotating core with multiple layers
      const coreScale = 1 + Math.sin(time * 4) * 0.15;
      
      // Outer rotating octagon
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-time * 0.4);
      ctx.scale(coreScale * 1.2 * (isHovered ? 1.2 : 1), coreScale * 1.2 * (isHovered ? 1.2 : 1));
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const x = Math.cos(angle) * 22;
        const y = Math.sin(angle) * 22;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = isHovered ? 'rgba(251, 191, 36, 0.7)' : 'rgba(139, 92, 246, 0.5)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = isHovered ? 'rgba(251, 191, 36, 0.9)' : 'rgba(139, 92, 246, 0.7)';
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Inner core
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.5);
      ctx.scale(coreScale * (isHovered ? 1.25 : 1), coreScale * (isHovered ? 1.25 : 1));
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const x = Math.cos(angle) * 16;
        const y = Math.sin(angle) * 16;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      
      const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 16);
      coreGradient.addColorStop(0, isHovered ? 'rgba(251, 191, 36, 1)' : 'rgba(168, 85, 247, 0.95)');
      coreGradient.addColorStop(0.6, isHovered ? 'rgba(168, 85, 247, 0.9)' : 'rgba(139, 92, 246, 0.85)');
      coreGradient.addColorStop(1, 'rgba(99, 102, 241, 0.6)');
      ctx.fillStyle = coreGradient;
      ctx.shadowBlur = 30;
      ctx.shadowColor = isHovered ? 'rgba(251, 191, 36, 1)' : 'rgba(168, 85, 247, 0.9)';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Draw upward arrow with advanced trail effects
      const arrowY = centerY - 8 + Math.sin(time * 3) * 10;
      
      // Draw multiple trails with fade
      for (let i = 0; i < 5; i++) {
        const trailY = arrowY + 12 + i * 10 + Math.sin(time * 3 - i * 0.7) * 6;
        const opacity = 0.7 - i * 0.12;
        const scale = 1 - i * 0.12;
        
        ctx.save();
        ctx.translate(centerX, trailY);
        ctx.scale(scale, scale);
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(-7, 0);
        ctx.lineTo(-3.5, 0);
        ctx.lineTo(-3.5, 10);
        ctx.lineTo(3.5, 10);
        ctx.lineTo(3.5, 0);
        ctx.lineTo(7, 0);
        ctx.closePath();
        
        const trailGradient = ctx.createLinearGradient(0, -10, 0, 10);
        trailGradient.addColorStop(0, `rgba(251, 191, 36, ${opacity})`);
        trailGradient.addColorStop(1, `rgba(245, 158, 11, ${opacity * 0.6})`);
        ctx.fillStyle = trailGradient;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(251, 191, 36, ${opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // Draw main arrow with enhanced glow
      ctx.save();
      ctx.translate(centerX, arrowY);
      ctx.scale(1.1, 1.1);
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(-9, 0);
      ctx.lineTo(-4.5, 0);
      ctx.lineTo(-4.5, 14);
      ctx.lineTo(4.5, 14);
      ctx.lineTo(4.5, 0);
      ctx.lineTo(9, 0);
      ctx.closePath();
      
      const arrowGradient = ctx.createLinearGradient(0, -14, 0, 14);
      arrowGradient.addColorStop(0, isHovered ? '#fef3c7' : '#fbbf24');
      arrowGradient.addColorStop(0.5, isHovered ? '#fbbf24' : '#f59e0b');
      arrowGradient.addColorStop(1, isHovered ? '#f59e0b' : '#d97706');
      ctx.fillStyle = arrowGradient;
      ctx.shadowBlur = 25;
      ctx.shadowColor = 'rgba(251, 191, 36, 1)';
      ctx.fill();
      
      // Add inner glow
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;
      ctx.restore();

      // Draw orbiting mini particles
      for (let i = 0; i < 12; i++) {
        const orbitAngle = time * 2 + (i * Math.PI * 2) / 12;
        const orbitRadius = 55;
        const x = centerX + Math.cos(orbitAngle) * orbitRadius;
        const y = centerY + Math.sin(orbitAngle) * orbitRadius;
        
        const orbitGradient = ctx.createRadialGradient(x, y, 0, x, y, 4);
        orbitGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        orbitGradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = orbitGradient;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config.canvas, isHovered]);

  return (
    <div 
      className={`inline-flex items-center gap-4 cursor-pointer select-none ${className}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      {/* Canvas Logo */}
      <div 
        className="relative"
        style={{ 
          width: config.canvas, 
          height: config.canvas,
          filter: isHovered 
            ? 'drop-shadow(0 0 40px rgba(251, 191, 36, 0.8)) drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))' 
            : 'drop-shadow(0 0 25px rgba(99, 102, 241, 0.5)) drop-shadow(0 0 15px rgba(6, 182, 212, 0.3))',
          transition: 'filter 0.4s ease'
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: config.canvas,
            height: config.canvas,
          }}
        />
        
        {/* Additional overlay effects */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isHovered 
              ? 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
            transition: 'background 0.4s ease',
            animation: isHovered ? 'pulse 1.5s ease-in-out infinite' : 'none'
          }}
        />
      </div>

      {/* Text Content */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div 
            className={`font-black tracking-tight ${config.text}`}
            style={{
              background: isHovered
                ? 'linear-gradient(135deg, #fbbf24 0%, #8b5cf6 50%, #06b6d4 100%)'
                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient 3s linear infinite',
              filter: isHovered ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))' : 'none',
              transition: 'filter 0.3s ease'
            }}
          >
            AuraUp
          </div>
          
          {showTagline && (
            <div 
              className={`font-bold ${config.tagline} mt-1`}
              style={{
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                opacity: isHovered ? 1 : 0.7,
                transition: 'opacity 0.3s ease',
                animation: 'gradient 4s linear infinite'
              }}
            >
              Elevate Your Digital Presence
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
