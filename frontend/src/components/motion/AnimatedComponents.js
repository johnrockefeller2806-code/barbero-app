import React from 'react';
import { motion } from 'framer-motion';

// Animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

// Animated wrapper components
export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionSpan = motion.span;
export const MotionH1 = motion.h1;
export const MotionH2 = motion.h2;
export const MotionP = motion.p;

// Fade In component with viewport detection
export const FadeIn = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.6,
  className = '',
  once = true,
  amount = 0.3
}) => {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction]
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once, amount }}
      transition={{ 
        duration, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger children animation
export const StaggerChildren = ({ 
  children, 
  className = '',
  staggerDelay = 0.1,
  once = true
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Child item for stagger
export const StaggerItem = ({ 
  children, 
  className = '',
  direction = 'up'
}) => {
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
    scale: { scale: 0.9, y: 0, x: 0 }
  };

  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          ...directions[direction]
        },
        visible: { 
          opacity: 1, 
          x: 0, 
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Hover scale effect for cards
export const HoverCard = ({ children, className = '', scale = 1.02 }) => {
  return (
    <motion.div
      whileHover={{ 
        scale,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Floating animation for decorative elements
export const FloatingElement = ({ 
  children, 
  className = '',
  duration = 3,
  distance = 10
}) => {
  return (
    <motion.div
      animate={{ 
        y: [-distance, distance, -distance]
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Pulse animation for CTAs
export const PulseButton = ({ children, className = '' }) => {
  return (
    <motion.div
      animate={{ 
        scale: [1, 1.02, 1]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Counter animation for stats
export const AnimatedCounter = ({ 
  value, 
  duration = 2,
  className = '' 
}) => {
  const numericValue = parseInt(value.replace(/\D/g, ''));
  const suffix = value.replace(/[0-9]/g, '');
  
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {value}
      </motion.span>
    </motion.span>
  );
};

// Text reveal animation
export const TextReveal = ({ 
  children, 
  className = '',
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Page transition wrapper
export const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Scroll-triggered progress bar
export const ScrollProgress = ({ className = '' }) => {
  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-50 ${className}`}
      style={{ scaleX: 0 }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: false }}
    />
  );
};

// Parallax effect
export const ParallaxSection = ({ 
  children, 
  className = '',
  speed = 0.5
}) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileInView={{ y: 0 }}
      viewport={{ once: false }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated gradient background
export const AnimatedGradient = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ backgroundPosition: '0% 50%' }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
    >
      {children}
    </motion.div>
  );
};

// Shimmer effect for loading states
export const ShimmerEffect = ({ className = '' }) => {
  return (
    <motion.div
      className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent ${className}`}
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
};
