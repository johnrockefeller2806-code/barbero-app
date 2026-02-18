import React from 'react';
import { motion } from 'framer-motion';

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

// Glow Pulse for buttons
export const GlowPulse = ({ children, className = '', color = 'amber' }) => {
  const colors = {
    amber: 'rgba(245, 158, 11, 0.5)',
    white: 'rgba(255, 255, 255, 0.3)',
    green: 'rgba(34, 197, 94, 0.5)'
  };

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg"
        animate={{
          boxShadow: [
            `0 0 20px ${colors[color]}`,
            `0 0 40px ${colors[color]}`,
            `0 0 20px ${colors[color]}`
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {children}
    </motion.div>
  );
};

// Text Reveal Animation
export const TextReveal = ({ children, className = '', delay = 0 }) => {
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

// Scissors Animation (for barber theme)
export const ScissorsAnimation = ({ className = '' }) => {
  return (
    <motion.div
      className={className}
      animate={{ 
        rotate: [0, 15, -15, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3
      }}
    />
  );
};

// Loading Spinner
export const Spinner = ({ size = 'md', color = 'amber' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colors = {
    amber: 'border-amber-500',
    white: 'border-white',
    zinc: 'border-zinc-500',
  };

  return (
    <motion.div
      className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

// Page Transition
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
