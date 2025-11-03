import { Variants } from "framer-motion";
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// Fade in variants
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Fade up variants
export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Slide in from left
export const slideInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Slide in from right
export const slideInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Scale in variants
export const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Stagger container
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Stagger item
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Hover scale effect
export const hoverScaleVariants = {
  scale: 1.05,
  transition: {
    duration: 0.2,
    ease: "easeInOut",
  },
};

// Tap scale effect
export const tapScaleVariants = {
  scale: 0.95,
};

// Float animation
export const floatVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Parallax variants
export const parallaxVariants = (offset: number = 50): Variants => ({
  hidden: {
    opacity: 0,
    y: offset,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
});

// Rotation variants
export const rotateInVariants: Variants = {
  hidden: {
    opacity: 0,
    rotate: -10,
  },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// ==================== GSAP Utilities ====================

/**
 * Fade in animation with GSAP
 */
export const gsapFadeIn = (
  element: HTMLElement | string,
  options?: {
    duration?: number;
    delay?: number;
    y?: number;
    x?: number;
    stagger?: number;
  }
) => {
  return gsap.from(element, {
    opacity: 0,
    y: options?.y ?? 30,
    x: options?.x ?? 0,
    duration: options?.duration ?? 0.8,
    delay: options?.delay ?? 0,
    stagger: options?.stagger ?? 0,
    ease: 'power3.out',
  });
};

/**
 * Scale in animation
 */
export const gsapScaleIn = (
  element: HTMLElement | string,
  options?: {
    duration?: number;
    delay?: number;
    scale?: number;
  }
) => {
  return gsap.from(element, {
    scale: options?.scale ?? 0.8,
    opacity: 0,
    duration: options?.duration ?? 0.6,
    delay: options?.delay ?? 0,
    ease: 'back.out(1.4)',
  });
};

/**
 * Parallax effect with scroll trigger
 */
export const gsapParallax = (
  element: HTMLElement | string,
  options?: {
    yPercent?: number;
    speed?: number;
  }
) => {
  return gsap.to(element, {
    yPercent: options?.yPercent ?? -50,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: options?.speed ?? 1,
    },
  });
};

/**
 * Reveal animation with scroll trigger
 */
export const gsapScrollReveal = (
  element: HTMLElement | string,
  options?: {
    duration?: number;
    y?: number;
    delay?: number;
    start?: string;
    end?: string;
  }
) => {
  return gsap.from(element, {
    opacity: 0,
    y: options?.y ?? 50,
    duration: options?.duration ?? 1,
    delay: options?.delay ?? 0,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: options?.start ?? 'top 80%',
      end: options?.end ?? 'top 20%',
      toggleActions: 'play none none reverse',
    },
  });
};

/**
 * Stagger animation for lists
 */
export const gsapStaggerFadeIn = (
  elements: HTMLElement[] | string,
  options?: {
    duration?: number;
    stagger?: number;
    y?: number;
  }
) => {
  return gsap.from(elements, {
    opacity: 0,
    y: options?.y ?? 30,
    duration: options?.duration ?? 0.6,
    stagger: options?.stagger ?? 0.1,
    ease: 'power2.out',
  });
};

/**
 * Floating animation for elements
 */
export const gsapFloat = (
  element: HTMLElement | string,
  options?: {
    duration?: number;
    y?: number;
  }
) => {
  return gsap.to(element, {
    y: options?.y ?? -10,
    duration: options?.duration ?? 2,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: -1,
  });
};

/**
 * Hook to initialize GSAP animations
 */
export const useGSAP = (
  callback: () => void | (() => void),
  dependencies: any[] = []
) => {
  useEffect(() => {
    const cleanup = callback();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, dependencies);
};

/**
 * Refresh all scroll triggers (useful after content loads)
 */
export const refreshScrollTriggers = () => {
  ScrollTrigger.refresh();
};
