import { useEffect, useRef, useState } from 'react';

interface AuraUpLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  interactive?: boolean;
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { canvas: 50, text: 'text-lg', tagline: 'text-xs' },
  md: { canvas: 70, text: 'text-xl', tagline: 'text-xs' },
  lg: { canvas: 100, text: 'text-3xl', tagline: 'text-sm' },
  xl: { canvas: 130, text: 'text-4xl', tagline: 'text-base' },
  hero: { canvas: 160, text: 'text-5xl', tagline: 'text-lg' },
};

export default function AuraUpLogo({
  size = 'lg',
  interactive = true,
  showText = true,
  showTagline = true,
  className = ''
}: AuraUpLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isTextHovered, setIsTextHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const resetTimeoutRef = useRef<number>();
  const config = sizeConfig[size];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = undefined;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setRotation({
      x: rotation.x + deltaY * 0.8,
      y: rotation.y + deltaX * 0.8,
    });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    resetTimeoutRef.current = window.setTimeout(() => {
      setRotation({ x: 0, y: 0 });
    }, 800);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const bgCanvas = bgCanvasRef.current;
    if (!canvas || !bgCanvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const bgCtx = bgCanvas.getContext('2d', { alpha: true });
    if (!ctx || !bgCtx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = config.canvas * dpr;
    canvas.height = config.canvas * dpr;
    bgCanvas.width = config.canvas * dpr;
    bgCanvas.height = config.canvas * dpr;

    canvas.style.width = `${config.canvas}px`;
    canvas.style.height = `${config.canvas}px`;
    bgCanvas.style.width = `${config.canvas}px`;
    bgCanvas.style.height = `${config.canvas}px`;

    ctx.scale(dpr, dpr);
    bgCtx.scale(dpr, dpr);

    const centerX = config.canvas / 2;
    const centerY = config.canvas / 2;
    const baseRadius = config.canvas * 0.35;

    const particles: {
      angle: number;
      distance: number;
      speed: number;
      size: number;
      brightness: number;
      color: string;
      pulse: number;
      orbit: number;
    }[] = [];

    const energyOrbs: {
      angle: number;
      distance: number;
      size: number;
      speed: number;
      phase: number;
    }[] = [];

    for (let i = 0; i < 300; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * baseRadius * 1.5,
        speed: 0.01 + Math.random() * 0.03,
        size: 0.5 + Math.random() * 3,
        brightness: Math.random(),
        color: ['#6366f1', '#8b5cf6', '#a855f7', '#06b6d4', '#22d3ee', '#fbbf24'][Math.floor(Math.random() * 6)],
        pulse: Math.random() * Math.PI * 2,
        orbit: Math.random() * Math.PI * 2,
      });
    }

    for (let i = 0; i < 12; i++) {
      energyOrbs.push({
        angle: (i * Math.PI * 2) / 12,
        distance: baseRadius * 0.9,
        size: 3 + Math.random() * 2,
        speed: 0.02,
        phase: i * 0.5
      });
    }

    let time = 0;

    const drawBackground = () => {
      bgCtx.clearRect(0, 0, config.canvas, config.canvas);

      for (let layer = 0; layer < 5; layer++) {
        const radius = config.canvas * (0.8 - layer * 0.1);
        const gradient = bgCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

        const alpha = (0.15 - layer * 0.02) * (1 + Math.sin(time * 2 + layer) * 0.3);
        gradient.addColorStop(0, `rgba(${99 + layer * 30}, ${102 + layer * 40}, 241, ${alpha})`);
        gradient.addColorStop(0.4, `rgba(139, ${92 + layer * 20}, 246, ${alpha * 0.6})`);
        gradient.addColorStop(0.7, `rgba(6, ${182 - layer * 20}, 212, ${alpha * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        bgCtx.fillStyle = gradient;
        bgCtx.fillRect(0, 0, config.canvas, config.canvas);
      }

      bgCtx.save();
      bgCtx.translate(centerX, centerY);
      bgCtx.rotate(time * 0.3);

      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI * 2) / 16;
        bgCtx.save();
        bgCtx.rotate(angle);

        const rayGradient = bgCtx.createLinearGradient(0, 0, baseRadius * 1.5, 0);
        rayGradient.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
        rayGradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.1)');
        rayGradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

        bgCtx.fillStyle = rayGradient;
        bgCtx.fillRect(baseRadius * 0.3, -2, baseRadius * 1.2, 4);
        bgCtx.restore();
      }
      bgCtx.restore();
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      time += isHovered ? 0.04 : 0.025;
      drawBackground();
      ctx.clearRect(0, 0, config.canvas, config.canvas);

      ctx.save();
      ctx.translate(centerX, centerY);
      for (let spiral = 0; spiral < 4; spiral++) {
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) {
          const angle = (i / 120) * Math.PI * 6 + time * (0.8 + spiral * 0.2);
          const dist = (baseRadius * 0.3) + (i / 120) * baseRadius * 0.7;
          const wave = Math.sin(i * 0.1 + time * 3) * 8;
          const x = Math.cos(angle) * (dist + wave);
          const y = Math.sin(angle) * (dist + wave);

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const spiralAlpha = (0.4 - spiral * 0.08) * (1 + Math.sin(time * 2 + spiral) * 0.3);
        ctx.strokeStyle = `rgba(${100 + spiral * 40}, ${200 - spiral * 30}, 255, ${spiralAlpha})`;
        ctx.lineWidth = 3 - spiral * 0.4;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(34, 211, 238, ${spiralAlpha})`;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.restore();

      energyOrbs.forEach((orb, i) => {
        orb.angle += orb.speed * (isHovered ? 1.8 : 1);
        const wave = Math.sin(time * 3 + orb.phase) * baseRadius * 0.15;
        const x = centerX + Math.cos(orb.angle) * (orb.distance + wave);
        const y = centerY + Math.sin(orb.angle) * (orb.distance + wave);

        const orbGradient = ctx.createRadialGradient(x, y, 0, x, y, orb.size * 4);
        const hue = (time * 100 + i * 30) % 360;
        orbGradient.addColorStop(0, `hsla(${hue}, 90%, 70%, 0.9)`);
        orbGradient.addColorStop(0.3, `hsla(${hue}, 80%, 60%, 0.6)`);
        orbGradient.addColorStop(1, `hsla(${hue}, 70%, 50%, 0)`);

        ctx.beginPath();
        ctx.arc(x, y, orb.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = orbGradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, orb.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${hue}, 90%, 70%, 1)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      particles.sort((a, b) => a.distance - b.distance);
      particles.forEach((p, i) => {
        p.angle += p.speed * (isHovered ? 2 : 1);
        p.orbit += 0.01;
        p.pulse += 0.05;

        const orbitalWave = Math.sin(p.orbit * 2) * baseRadius * 0.2;
        const distWave = p.distance + Math.sin(time * 2 + p.pulse) * baseRadius * 0.15;

        const x = centerX + Math.cos(p.angle) * distWave + Math.cos(p.orbit) * orbitalWave;
        const y = centerY + Math.sin(p.angle) * distWave + Math.sin(p.orbit) * orbitalWave;

        const brightness = (Math.sin(p.pulse * 2 + time * 4) + 1) / 2;
        const alpha = 0.6 + brightness * 0.4;

        if (i % 3 === 0) {
          ctx.save();
          ctx.globalAlpha = alpha * 0.3;
          ctx.beginPath();
          ctx.moveTo(x, y);
          const trailX = centerX + Math.cos(p.angle - 0.1) * distWave;
          const trailY = centerY + Math.sin(p.angle - 0.1) * distWave;
          ctx.lineTo(trailX, trailY);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * 0.5;
          ctx.stroke();
          ctx.restore();
        }

        const pGradient = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3);
        pGradient.addColorStop(0, p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba'));
        pGradient.addColorStop(0.3, p.color.replace(')', `, ${alpha * 0.7})`).replace('rgb', 'rgba'));
        pGradient.addColorStop(0.6, p.color.replace(')', `, ${alpha * 0.3})`).replace('rgb', 'rgba'));
        pGradient.addColorStop(1, p.color.replace(')', ', 0)').replace('rgb', 'rgba'));

        ctx.beginPath();
        ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = pGradient;
        ctx.fill();
      });

      for (let ring = 0; ring < 5; ring++) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(time * (0.5 + ring * 0.15) * (ring % 2 === 0 ? 1 : -1));

        const ringRadius = baseRadius * (0.5 + ring * 0.12);
        const segments = 60;

        for (let seg = 0; seg < segments; seg++) {
          const angle1 = (seg * Math.PI * 2) / segments;
          const angle2 = ((seg + 1) * Math.PI * 2) / segments;

          const segmentAlpha = Math.abs(Math.sin(seg * 0.1 + time * 2 + ring)) * 0.4;

          ctx.beginPath();
          ctx.arc(0, 0, ringRadius, angle1, angle2);
          ctx.strokeStyle = `rgba(${99 + ring * 30}, ${102 + ring * 40}, 241, ${segmentAlpha})`;
          ctx.lineWidth = 4 - ring * 0.5;
          ctx.shadowBlur = 12;
          ctx.shadowColor = 'rgba(139, 92, 246, 0.8)';
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.2);

      for (let hex = 0; hex < 3; hex++) {
        const hexRadius = baseRadius * (0.4 + hex * 0.2);
        ctx.beginPath();
        for (let i = 0; i <= 6; i++) {
          const angle = (i * Math.PI * 2) / 6;
          const x = Math.cos(angle) * hexRadius;
          const y = Math.sin(angle) * hexRadius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const hexAlpha = 0.3 - hex * 0.08;
        ctx.strokeStyle = `rgba(139, 92, 246, ${hexAlpha})`;
        ctx.lineWidth = 3 - hex * 0.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(139, 92, 246, 0.6)';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.restore();

      const coreScale = 1 + Math.sin(time * 4) * 0.12;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(coreScale * 1.15, coreScale * 1.15);

      const outerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius * 0.35);
      outerGradient.addColorStop(0, 'rgba(139, 92, 246, 0)');
      outerGradient.addColorStop(0.7, 'rgba(139, 92, 246, 0.4)');
      outerGradient.addColorStop(1, 'rgba(99, 102, 241, 0.6)');

      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = outerGradient;
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(139, 92, 246, 0.9)';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-time * 0.6);
      ctx.scale(coreScale * 1.1, coreScale * 1.1);

      const sides = 8;
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = (i * Math.PI * 2) / sides;
        const x = Math.cos(angle) * baseRadius * 0.28;
        const y = Math.sin(angle) * baseRadius * 0.28;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const midGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius * 0.28);
      midGradient.addColorStop(0, 'rgba(196, 181, 253, 0.9)');
      midGradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.8)');
      midGradient.addColorStop(1, 'rgba(99, 102, 241, 0.7)');

      ctx.fillStyle = midGradient;
      ctx.shadowBlur = 35;
      ctx.shadowColor = 'rgba(168, 85, 247, 1)';
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.8);
      ctx.scale(coreScale * 1.05, coreScale * 1.05);

      const innerSides = 6;
      ctx.beginPath();
      for (let i = 0; i <= innerSides; i++) {
        const angle = (i * Math.PI * 2) / innerSides;
        const x = Math.cos(angle) * baseRadius * 0.2;
        const y = Math.sin(angle) * baseRadius * 0.2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const innerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius * 0.2);
      innerGradient.addColorStop(0, '#fef3c7');
      innerGradient.addColorStop(0.4, '#fbbf24');
      innerGradient.addColorStop(0.8, '#f59e0b');
      innerGradient.addColorStop(1, '#d97706');

      ctx.fillStyle = innerGradient;
      ctx.shadowBlur = 50;
      ctx.shadowColor = '#fbbf24';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.8);

      for (let beam = 0; beam < 12; beam++) {
        const angle = (beam * Math.PI * 2) / 12;
        ctx.save();
        ctx.rotate(angle);

        const beamGradient = ctx.createLinearGradient(baseRadius * 0.3, 0, baseRadius * 1.2, 0);
        const beamAlpha = (Math.sin(time * 3 + beam * 0.5) + 1) / 2;
        beamGradient.addColorStop(0, `rgba(34, 211, 238, ${beamAlpha * 0.6})`);
        beamGradient.addColorStop(0.5, `rgba(6, 182, 212, ${beamAlpha * 0.4})`);
        beamGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = beamGradient;
        ctx.fillRect(baseRadius * 0.3, -3, baseRadius * 0.9, 6);

        ctx.restore();
      }
      ctx.restore();

      const arrowBaseY = centerY - baseRadius * 0.15;
      const arrowFloat = Math.sin(time * 3) * baseRadius * 0.12;
      const arrowY = arrowBaseY + arrowFloat;
      const arrowScale = 1 + Math.sin(time * 4) * 0.08;

      for (let trail = 0; trail < 6; trail++) {
        const trailY = arrowY + baseRadius * (0.15 + trail * 0.08) + Math.sin(time * 3 - trail * 0.6) * baseRadius * 0.06;
        const trailAlpha = 0.7 - trail * 0.11;
        const trailScale = (1 - trail * 0.1) * arrowScale;

        ctx.save();
        ctx.translate(centerX, trailY);
        ctx.scale(trailScale, trailScale);

        ctx.beginPath();
        ctx.moveTo(0, -baseRadius * 0.12);
        ctx.lineTo(-baseRadius * 0.09, 0);
        ctx.lineTo(-baseRadius * 0.045, 0);
        ctx.lineTo(-baseRadius * 0.045, baseRadius * 0.12);
        ctx.lineTo(baseRadius * 0.045, baseRadius * 0.12);
        ctx.lineTo(baseRadius * 0.045, 0);
        ctx.lineTo(baseRadius * 0.09, 0);
        ctx.closePath();

        const trailGradient = ctx.createLinearGradient(0, -baseRadius * 0.12, 0, baseRadius * 0.12);
        trailGradient.addColorStop(0, `rgba(251, 191, 36, ${trailAlpha})`);
        trailGradient.addColorStop(0.5, `rgba(245, 158, 11, ${trailAlpha * 0.8})`);
        trailGradient.addColorStop(1, `rgba(217, 119, 6, ${trailAlpha * 0.6})`);

        ctx.fillStyle = trailGradient;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(251, 191, 36, ${trailAlpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      ctx.save();
      ctx.translate(centerX, arrowY);
      ctx.scale(arrowScale * 1.2, arrowScale * 1.2);

      ctx.beginPath();
      ctx.moveTo(0, -baseRadius * 0.15);
      ctx.lineTo(-baseRadius * 0.11, 0);
      ctx.lineTo(-baseRadius * 0.05, 0);
      ctx.lineTo(-baseRadius * 0.05, baseRadius * 0.15);
      ctx.lineTo(baseRadius * 0.05, baseRadius * 0.15);
      ctx.lineTo(baseRadius * 0.05, 0);
      ctx.lineTo(baseRadius * 0.11, 0);
      ctx.closePath();

      const arrowGradient = ctx.createLinearGradient(0, -baseRadius * 0.15, 0, baseRadius * 0.15);
      arrowGradient.addColorStop(0, '#fef3c7');
      arrowGradient.addColorStop(0.3, '#fbbf24');
      arrowGradient.addColorStop(0.6, '#f59e0b');
      arrowGradient.addColorStop(1, '#d97706');

      ctx.fillStyle = arrowGradient;
      ctx.shadowBlur = 40;
      ctx.shadowColor = '#fbbf24';
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.stroke();

      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;

      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config.canvas, isHovered]);

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        resetTimeoutRef.current = window.setTimeout(() => {
          setRotation({ x: 0, y: 0 });
        }, 800);
      };

      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <div
        className="relative cursor-pointer select-none"
        onMouseEnter={() => interactive && setIsHovered(true)}
        onMouseLeave={() => interactive && setIsHovered(false)}
        style={{
          transform: `scale(${isHovered && !isTextHovered ? 1.08 : 1})`,
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.6s ease',
          filter: isTextHovered ? 'blur(3px) brightness(0.7)' : 'none',
        }}
      >
        <div
          className="relative"
          style={{
            width: config.canvas,
            height: config.canvas,
            borderRadius: '50%',
            overflow: 'hidden',
            filter: 'drop-shadow(0 10px 40px rgba(99, 102, 241, 0.7)) drop-shadow(0 0 30px rgba(139, 92, 246, 0.6)) brightness(1.1)',
            boxShadow: isHovered && !isTextHovered
              ? '0 0 0 3px rgba(139, 92, 246, 0.5), 0 0 0 6px rgba(99, 102, 241, 0.3), 0 0 60px rgba(139, 92, 246, 0.6)'
              : '0 0 0 2px rgba(139, 92, 246, 0.3), 0 0 0 4px rgba(99, 102, 241, 0.2)',
            transition: 'box-shadow 0.6s ease',
          }}
        >
          <canvas
            ref={bgCanvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: config.canvas,
              height: config.canvas,
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: config.canvas,
              height: config.canvas,
            }}
          />
        </div>
      </div>

      {showText && (
        <div
          className="relative select-none"
          style={{
            perspective: '1200px',
            cursor: isDragging ? 'grabbing' : 'default',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsTextHovered(true)}
          onMouseLeave={() => setIsTextHovered(false)}
        >
          <h1
            className={`${config.text} font-black tracking-wide text-center relative leading-none`}
            style={{
              fontFamily: "'Orbitron', 'Exo 2', sans-serif",
              textTransform: 'uppercase',
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(50px) scale(${isTextHovered ? 1.1 : 1})`,
              transformStyle: 'preserve-3d',
              transition: isDragging
                ? 'transform 0.05s linear, filter 0.4s ease'
                : 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              filter: isTextHovered
                ? 'drop-shadow(0 6px 30px rgba(168, 85, 247, 1)) contrast(1.4) brightness(1.6)'
                : 'drop-shadow(0 4px 20px rgba(168, 85, 247, 0.9)) contrast(1.3) brightness(1.4)',
            }}
          >
            {[...Array(15)].map((_, i) => (
              <span
                key={`shadow-${i}`}
                className="absolute inset-0"
                style={{
                  transform: `translateZ(-${i * 2}px)`,
                  opacity: 0.1 - i * 0.005,
                  color: '#7c3aed',
                  filter: `blur(${i * 0.2}px)`,
                }}
                aria-hidden="true"
              >
                AuraUp
              </span>
            ))}

            <span
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #c084fc, #a855f7, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'blur(14px)',
                opacity: 0.8,
                transform: 'translateZ(10px)',
              }}
              aria-hidden="true"
            >
              AuraUp
            </span>

            <span
              className="relative"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #fefce8 10%, #fef3c7 20%, #fde68a 30%, #fcd34d 45%, #fbbf24 65%, #f59e0b 85%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                transform: 'translateZ(55px)',
                WebkitTextStroke: '1px rgba(251, 191, 36, 0.3)',
              }}
            >
              AuraUp
            </span>

            <span
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.6) 25%, transparent 50%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                transform: 'translateZ(58px)',
                opacity: 0.7,
              }}
              aria-hidden="true"
            >
              AuraUp
            </span>
          </h1>
        </div>
      )}

      {showTagline && (
        <div
          className="relative select-none -mt-1"
          style={{
            perspective: '1000px',
            cursor: isDragging ? 'grabbing' : 'default',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsTextHovered(true)}
          onMouseLeave={() => setIsTextHovered(false)}
        >
          <p
            className={`${config.tagline} font-bold tracking-widest uppercase text-center relative leading-tight`}
            style={{
              fontFamily: "'Rajdhani', 'Exo 2', sans-serif",
              transform: `rotateX(${rotation.x * 0.7}deg) rotateY(${rotation.y * 0.7}deg) translateZ(30px) scale(${isTextHovered ? 1.08 : 1})`,
              transformStyle: 'preserve-3d',
              transition: isDragging
                ? 'transform 0.05s linear, filter 0.4s ease'
                : 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              filter: isTextHovered
                ? 'drop-shadow(0 4px 20px rgba(168, 85, 247, 0.9)) brightness(1.5)'
                : 'drop-shadow(0 3px 15px rgba(168, 85, 247, 0.8)) brightness(1.3)',
            }}
          >
            {[...Array(10)].map((_, i) => (
              <span
                key={`tagline-shadow-${i}`}
                className="absolute inset-0"
                style={{
                  transform: `translateZ(-${i * 1.5}px)`,
                  opacity: 0.08 - i * 0.006,
                  color: '#8b5cf6',
                  filter: `blur(${i * 0.15}px)`,
                }}
                aria-hidden="true"
              >
                Elevate Your Energy
              </span>
            ))}

            <span
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #d8b4fe, #c084fc, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'blur(12px)',
                opacity: 0.7,
                transform: 'translateZ(5px)',
              }}
              aria-hidden="true"
            >
              Elevate Your Energy
            </span>

            <span
              className="relative"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #fef9c3 15%, #fef08a 30%, #fde047 50%, #facc15 70%, #eab308 90%, #ca8a04 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                transform: 'translateZ(33px)',
                WebkitTextStroke: '0.5px rgba(234, 179, 8, 0.2)',
              }}
            >
              Elevate Your Energy
            </span>

            <span
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 20%, transparent 40%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                transform: 'translateZ(35px)',
                opacity: 0.6,
              }}
              aria-hidden="true"
            >
              Elevate Your Energy
            </span>
          </p>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&family=Exo+2:wght@700;800;900&family=Rajdhani:wght@600;700&display=swap');
      `}</style>
    </div>
  );
}
