import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  phase: number;
  speed: number;
  radius: number;
}

// Enhanced Particle System
const EnhancedParticles = ({ isHovered }: { isHovered: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesRef = useRef<Particle[]>([]);
  const count = 200;

  useEffect(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 0.8 + Math.random() * 0.4;
      
      particles.push({
        position: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
        radius: r
      });
    }
    particlesRef.current = particles;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;
    const multiplier = isHovered ? 1.5 : 1;

    particlesRef.current.forEach((p, i) => {
      const angle = time * p.speed * multiplier + p.phase;
      const r = p.radius + Math.sin(angle * 2) * 0.15;
      
      positions[i * 3] = r * Math.sin(p.position.y + angle) * Math.cos(p.position.z);
      positions[i * 3 + 1] = r * Math.sin(angle * 1.3) * 0.8;
      positions[i * 3 + 2] = r * Math.cos(p.position.y + angle) * Math.sin(p.position.z);

      const intensity = (Math.sin(angle * 3) + 1) * 0.5;
      colors[i * 3] = 0.3 + intensity * 0.5;
      colors[i * 3 + 1] = 0.5 + intensity * 0.3;
      colors[i * 3 + 2] = 0.9 + intensity * 0.1;
    });

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.2;
  });

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

// Glowing Geometric Core
const GeometricCore = ({ isHovered }: { isHovered: boolean }) => {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (outerRef.current) {
      outerRef.current.rotation.x = time * 0.3;
      outerRef.current.rotation.y = time * 0.4;
      const scale = 1 + Math.sin(time * 2) * 0.08;
      outerRef.current.scale.setScalar(scale * (isHovered ? 1.15 : 1));
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.x = -time * 0.4;
      innerRef.current.rotation.z = time * 0.3;
      innerRef.current.scale.setScalar(0.7 + Math.sin(time * 3) * 0.1);
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z = time * 0.5;
    }
  });

  return (
    <group>
      {/* Outer Icosahedron */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial
          color={isHovered ? "#8b5cf6" : "#6366f1"}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Inner Octahedron */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshBasicMaterial
          color={isHovered ? "#a855f7" : "#8b5cf6"}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Rotating Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.6, 0.03, 16, 64]} />
        <meshBasicMaterial
          color={isHovered ? "#22d3ee" : "#06b6d4"}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

// Energy Beams
const EnergyBeams = ({ isHovered }: { isHovered: boolean }) => {
  const beamsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!beamsRef.current) return;
    beamsRef.current.rotation.y = state.clock.elapsedTime * 0.6;
  });

  return (
    <group ref={beamsRef}>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <mesh key={i} position={[Math.cos(rad) * 0.8, 0, Math.sin(rad) * 0.8]} rotation={[0, rad, 0]}>
            <boxGeometry args={[0.03, 2, 0.03]} />
            <meshBasicMaterial
              color={isHovered ? "#22d3ee" : "#06b6d4"}
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Upward Arrow with Trails
const ArrowWithTrails = ({ isHovered }: { isHovered: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const trailsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 2) * 0.2;
    }

    if (trailsRef.current) {
      trailsRef.current.children.forEach((child, i) => {
        child.position.y = -0.3 - i * 0.2 + (Math.sin(time * 2 - i * 0.5) * 0.1);
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = 0.6 - i * 0.15;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Arrow */}
      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.2, 0.4, 4]} />
        <meshBasicMaterial color={isHovered ? "#fbbf24" : "#f59e0b"} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshBasicMaterial color={isHovered ? "#fbbf24" : "#f59e0b"} />
      </mesh>

      {/* Trailing Arrows */}
      <group ref={trailsRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}>
            <coneGeometry args={[0.15, 0.3, 4]} />
            <meshBasicMaterial transparent color="#f59e0b" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Static SVG Fallback with Enhanced Design
const StaticLogo = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <linearGradient id="arrow" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <circle cx="50" cy="50" r="45" fill="url(#bg)" opacity="0.9" filter="url(#glow)">
      <animate attributeName="r" values="45;47;45" dur="2s" repeatCount="indefinite"/>
    </circle>
    
    <circle cx="50" cy="50" r="30" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite"/>
    </circle>
    
    <path d="M50 20 L60 35 L55 35 L55 60 L45 60 L45 35 L40 35 Z" fill="url(#arrow)" filter="url(#glow)">
      <animateTransform attributeName="transform" type="translate" values="0,0; 0,-3; 0,0" dur="1.5s" repeatCount="indefinite"/>
    </path>
  </svg>
);

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
  const [supports3D, setSupports3D] = useState(true);
  const config = sizeConfig[size];

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setSupports3D(!!gl);
    } catch {
      setSupports3D(false);
    }
  }, []);

  return (
    <div 
      className={`inline-flex items-center gap-4 cursor-pointer select-none ${className}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }}
    >
      {/* Logo Container */}
      <div 
        className="relative"
        style={{ 
          width: config.canvas, 
          height: config.canvas,
          filter: isHovered ? 'drop-shadow(0 0 30px rgba(99, 102, 241, 0.6))' : 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.4))',
          transition: 'filter 0.3s ease'
        }}
      >
        {supports3D ? (
          <Suspense fallback={<StaticLogo size={config.canvas} />}>
            <Canvas
              camera={{ position: [0, 0, 3.5], fov: 50 }}
              style={{ width: config.canvas, height: config.canvas }}
              gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <EnhancedParticles isHovered={isHovered} />
              <GeometricCore isHovered={isHovered} />
              <EnergyBeams isHovered={isHovered} />
              <ArrowWithTrails isHovered={isHovered} />
            </Canvas>
          </Suspense>
        ) : (
          <StaticLogo size={config.canvas} />
        )}
      </div>

      {/* Text Content */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div 
            className={`font-black tracking-tight ${config.text}`}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: isHovered ? 'gradient 2s linear infinite' : 'none'
            }}
          >
            AuraUp
          </div>
          
          {showTagline && (
            <div 
              className={`text-gray-600 font-semibold ${config.tagline} mt-1`}
              style={{
                opacity: isHovered ? 1 : 0.7,
                transition: 'opacity 0.3s ease'
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
      `}</style>
    </div>
  );
}
