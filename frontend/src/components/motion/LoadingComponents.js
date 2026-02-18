import React from 'react';
import { motion } from 'framer-motion';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_dublin-study/artifacts/o9gnc0xi_WhatsApp%20Image%202026-01-11%20at%2023.59.07.jpeg";

// Main Loading Screen Component
export const LoadingScreen = ({ message = "Carregando..." }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 flex items-center justify-center z-50">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-700/30"
            style={{
              width: `${150 + i * 100}px`,
              height: `${150 + i * 100}px`,
              left: `${20 + i * 10}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with pulse animation */}
        <motion.div
          className="mb-8"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.img
            src={LOGO_URL}
            alt="STUFF Intercâmbio"
            className="h-24 w-auto object-contain bg-white/10 backdrop-blur-sm rounded-2xl p-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* Loading dots */}
        <div className="flex gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-4 h-4 bg-amber-500 rounded-full"
              animate={{
                y: [-10, 10, -10],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <motion.p
          className="text-emerald-100 text-lg font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
};

// Skeleton Loading for Cards
export const CardSkeleton = () => {
  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="h-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ backgroundSize: '200% 100%' }}
      />
      <div className="p-6 space-y-4">
        <motion.div
          className="h-6 w-3/4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: 0.1,
          }}
          style={{ backgroundSize: '200% 100%' }}
        />
        <motion.div
          className="h-4 w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: 0.2,
          }}
          style={{ backgroundSize: '200% 100%' }}
        />
        <motion.div
          className="h-4 w-2/3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: 0.3,
          }}
          style={{ backgroundSize: '200% 100%' }}
        />
      </div>
    </motion.div>
  );
};

// Animated Button Component
export const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30',
    secondary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30',
    outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
    ghost: 'text-emerald-600 hover:bg-emerald-50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-semibold
        inline-flex items-center justify-center gap-2
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        y: disabled ? 0 : -2,
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {loading ? (
        <motion.div
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </motion.button>
  );
};

// Animated Price Card
export const PriceCard = ({
  title,
  price,
  currency = '€',
  period,
  features = [],
  highlighted = false,
  onSelect,
  buttonText = 'Selecionar',
}) => {
  return (
    <motion.div
      className={`
        relative rounded-2xl p-6 
        ${highlighted 
          ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-2xl shadow-emerald-500/30' 
          : 'bg-white border-2 border-slate-200 shadow-lg'
        }
      `}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Highlighted badge */}
      {highlighted && (
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          MAIS POPULAR
        </motion.div>
      )}

      {/* Title */}
      <h3 className={`text-xl font-bold mb-2 ${highlighted ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h3>

      {/* Price */}
      <div className="mb-6">
        <motion.span
          className={`text-5xl font-bold ${highlighted ? 'text-white' : 'text-emerald-600'}`}
          initial={{ scale: 0.5 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          {currency}{price}
        </motion.span>
        {period && (
          <span className={`text-sm ml-1 ${highlighted ? 'text-emerald-100' : 'text-slate-500'}`}>
            /{period}
          </span>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            className={`flex items-center gap-2 text-sm ${highlighted ? 'text-emerald-100' : 'text-slate-600'}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                highlighted ? 'bg-amber-500' : 'bg-emerald-100'
              }`}
              whileHover={{ scale: 1.2, rotate: 360 }}
            >
              <svg className={`w-3 h-3 ${highlighted ? 'text-white' : 'text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            {feature}
          </motion.li>
        ))}
      </ul>

      {/* Button */}
      <motion.button
        onClick={onSelect}
        className={`
          w-full py-3 rounded-xl font-semibold
          ${highlighted 
            ? 'bg-white text-emerald-700 hover:bg-emerald-50' 
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {buttonText}
      </motion.button>
    </motion.div>
  );
};

// Animated Counter
export const AnimatedNumber = ({ value, duration = 2, prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let startTime;
    const numericValue = parseInt(value.toString().replace(/\D/g, ''));

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setDisplayValue(Math.floor(progress * numericValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
};

// Spinner Loading
export const Spinner = ({ size = 'md', color = 'emerald' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colors = {
    emerald: 'border-emerald-500',
    amber: 'border-amber-500',
    white: 'border-white',
  };

  return (
    <motion.div
      className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

// Page Loader
export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 mx-auto mb-4"
        >
          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-amber-500 rounded-2xl" />
        </motion.div>
        <motion.p
          className="text-slate-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Carregando...
        </motion.p>
      </div>
    </div>
  );
};
