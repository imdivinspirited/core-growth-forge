import { useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Play, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// Enhanced Animated Sphere with dynamic colors
const AnimatedSphere = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Subtle rotation following mouse
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      mousePosition.y * 0.3,
      0.05
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mousePosition.x * 0.3 + time * 0.1,
      0.05
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} visible args={[1, 100, 200]} scale={2.5}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

// Floating particles effect
const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 500;
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    
    colors[i * 3] = 0.5 + Math.random() * 0.5;
    colors[i * 3 + 1] = 0.3 + Math.random() * 0.3;
    colors[i * 3 + 2] = 1;
  }
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </points>
  );
};

// Animated stat counter
const AnimatedCounter = ({ value, suffix = '', label }: { value: string; suffix?: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div 
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div 
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2"
        initial={{ scale: 0.5 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
      >
        {value}{suffix}
      </motion.div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const opacitySpring = useSpring(opacity, springConfig);
  const scaleSpring = useSpring(scale, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mousePosition.current = {
      x: (clientX / innerWidth - 0.5) * 2,
      y: (clientY / innerHeight - 0.5) * 2
    };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero timeline with staggered animations
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // Badge animation
      tl.from('.hero-badge', {
        y: -30,
        opacity: 0,
        duration: 0.8,
        scale: 0.8,
      });

      // Title split animation
      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        rotationX: 45,
        transformOrigin: 'center bottom',
      }, '-=0.4');

      // Subtitle
      tl.from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
      }, '-=0.6');

      // CTA buttons with stagger
      tl.from('.cta-button', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      }, '-=0.5');

      // Stats
      tl.from('.stat-item', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
      }, '-=0.3');

      // Parallax scroll effect
      if (heroRef.current) {
        gsap.to('.hero-bg', {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
          y: 200,
          scale: 1.1,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background hero-bg" />
      
      {/* Animated gradient orbs */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6366f1" />
          <AnimatedSphere mousePosition={mousePosition.current} />
          <ParticleField />
          <Stars radius={100} depth={50} count={1000} factor={4} fade speed={1} />
        </Canvas>
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 text-center"
        style={{ opacity: opacitySpring, scale: scaleSpring, y: ySpring }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div 
            className="hero-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm"
            whileHover={{ scale: 1.05, borderColor: 'hsl(var(--primary))' }}
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to the Future of Learning
            </span>
          </motion.div>

          {/* Title */}
          <h1 
            ref={titleRef}
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-none tracking-tight"
          >
            <span className="block bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              AuraUp
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Elevate your skills, transform your career, and unlock your 
            <span className="text-primary font-medium"> full potential </span>
            with our comprehensive learning platform.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="cta-button">
              <Button size="lg" className="group text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25" asChild>
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="cta-button">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 backdrop-blur-sm" asChild>
                <Link to="/courses" className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="stat-item">
              <AnimatedCounter value="50" suffix="+" label="Expert Courses" />
            </div>
            <div className="stat-item">
              <AnimatedCounter value="10K" suffix="+" label="Active Learners" />
            </div>
            <div className="stat-item">
              <AnimatedCounter value="95" suffix="%" label="Success Rate" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-muted-foreground cursor-pointer"
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
        >
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center p-1">
            <motion.div
              className="w-1.5 h-3 bg-primary rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-ping" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-accent rounded-full animate-pulse" />
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
    </section>
  );
};

export default HeroSection;
