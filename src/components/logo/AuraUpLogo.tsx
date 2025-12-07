import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { getDynamicText } from '@/lib/dynamicContent';

interface AuraParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
}

// 3D Aura Effect Component
const AuraEffect = ({ isHovered }: { isHovered: boolean }) => {
  const meshRef = useRef<THREE.Points>(null);
  const particlesRef = useRef<AuraParticle[]>([]);
  const positionsRef = useRef<Float32Array | null>(null);
  const colorsRef = useRef<Float32Array | null>(null);
  
  const particleCount = 150;

  useEffect(() => {
    const particles: AuraParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 1;
      particles.push({
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 2,
          Math.sin(angle) * radius
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          0.02 + Math.random() * 0.03,
          (Math.random() - 0.5) * 0.02
        ),
        life: Math.random() * 100,
        maxLife: 100,
        size: 0.02 + Math.random() * 0.03,
      });
    }
    particlesRef.current = particles;
    positionsRef.current = new Float32Array(particleCount * 3);
    colorsRef.current = new Float32Array(particleCount * 3);
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !positionsRef.current || !colorsRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = positionsRef.current;
    const colors = colorsRef.current;
    const speed = isHovered ? 1.5 : 1;

    particlesRef.current.forEach((particle, i) => {
      particle.position.add(particle.velocity.clone().multiplyScalar(speed));
      particle.life += 1;

      if (particle.position.y > 2 || particle.life > particle.maxLife) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.3 + Math.random() * 0.7;
        particle.position.set(Math.cos(angle) * radius, -1, Math.sin(angle) * radius);
        particle.life = 0;
      }

      const spiralAngle = time * 0.5 + i * 0.1;
      particle.position.x += Math.sin(spiralAngle) * 0.005 * speed;
      particle.position.z += Math.cos(spiralAngle) * 0.005 * speed;

      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;

      const heightNorm = (particle.position.y + 1) / 3;
      colors[i * 3] = 0.4 + heightNorm * 0.4;
      colors[i * 3 + 1] = 0.3 + (1 - heightNorm) * 0.3;
      colors[i * 3 + 2] = 0.9;
    });

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.attributes.color.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positionsRef.current || new Float32Array(particleCount * 3)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colorsRef.current || new Float32Array(particleCount * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Glowing Core
const GlowingCore = ({ isHovered }: { isHovered: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const scale = 1 + Math.sin(time * 2) * 0.1 * (isHovered ? 1.5 : 1);
    meshRef.current.scale.setScalar(scale);
    meshRef.current.rotation.y = time * 0.3;
    meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.3, 2]} />
      <meshBasicMaterial
        color={isHovered ? "#a855f7" : "#6366f1"}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

// Rising Arrow Effect
const RisingArrow = ({ isHovered }: { isHovered: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(time * 1.5) * 0.15;
    groupRef.current.rotation.y = time * 0.2;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[0.15, 0.3, 4]} />
        <meshBasicMaterial color={isHovered ? "#22d3ee" : "#06b6d4"} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshBasicMaterial color={isHovered ? "#22d3ee" : "#06b6d4"} transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

// Static SVG Fallback
const StaticLogo = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" className={className} fill="none">
    <defs>
      <linearGradient id="auraGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(220 100% 60%)" />
        <stop offset="50%" stopColor="hsl(270 80% 60%)" />
        <stop offset="100%" stopColor="hsl(200 100% 55%)" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="20" cy="20" r="16" fill="url(#auraGradient)" filter="url(#glow)" opacity="0.9" />
    <path d="M20 8 L26 18 L23 18 L23 28 L17 28 L17 18 L14 18 Z" fill="white" fillOpacity="0.95" />
  </svg>
);

interface AuraUpLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  interactive?: boolean;
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { canvas: 36, fontSize: 'text-xl', taglineSize: 'text-[10px]' },
  md: { canvas: 48, fontSize: 'text-2xl', taglineSize: 'text-xs' },
  lg: { canvas: 64, fontSize: 'text-3xl', taglineSize: 'text-sm' },
  xl: { canvas: 96, fontSize: 'text-4xl', taglineSize: 'text-base' },
  hero: { canvas: 120, fontSize: 'text-6xl', taglineSize: 'text-lg' },
};

export const AuraUpLogo = ({ 
  size = 'md', 
  interactive = true, 
  showText = true,
  showTagline = false,
  className = '' 
}: AuraUpLogoProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [is3DSupported, setIs3DSupported] = useState(true);
  const [tagline] = useState(() => getDynamicText('logoTagline'));
  const { canvas, fontSize, taglineSize } = sizeMap[size];

  useEffect(() => {
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      setIs3DSupported(!!gl);
    } catch {
      setIs3DSupported(false);
    }
  }, []);

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      whileHover={interactive ? { scale: 1.03 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
    >
      {/* Logo Icon */}
      <div className="relative" style={{ width: canvas, height: canvas }}>
        {is3DSupported ? (
          <Suspense fallback={<StaticLogo size={canvas} />}>
            <Canvas
              camera={{ position: [0, 0, 4], fov: 45 }}
              style={{ width: canvas, height: canvas }}
              gl={{ alpha: true, antialias: true }}
            >
              <ambientLight intensity={0.5} />
              <AuraEffect isHovered={isHovered} />
              <GlowingCore isHovered={isHovered} />
              <RisingArrow isHovered={isHovered} />
            </Canvas>
          </Suspense>
        ) : (
          <motion.div animate={isHovered ? { scale: [1, 1.1, 1] } : undefined} transition={{ duration: 0.5 }}>
            <StaticLogo size={canvas} />
          </motion.div>
        )}
        
        {/* Glow overlay */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, hsl(220 100% 60% / 0.3) 0%, transparent 70%)' }}
          animate={{ opacity: isHovered ? 0.8 : 0.4, scale: isHovered ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Text & Tagline */}
      {showText && (
        <div className="flex flex-col">
          <motion.span 
            className={`font-black tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] ${fontSize}`}
            animate={isHovered ? { backgroundPosition: ['0%', '100%'] } : undefined}
            transition={{ duration: 1, ease: 'linear' }}
          >
            AuraUp
          </motion.span>
          
          {showTagline && (
            <motion.span 
              className={`text-muted-foreground font-medium ${taglineSize} mt-0.5`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {tagline}
            </motion.span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AuraUpLogo;
