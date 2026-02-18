import React from 'react';

// ============== IRELAND THEMED SVG VECTORS ==============

// Shamrock (Trevo Irlandês)
export const ShamrockIcon = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 100 100" fill="currentColor" {...props}>
    <path d="M50 85c0 0-3-12-3-18c0-4 2-7 3-8c1 1 3 4 3 8c0 6-3 18-3 18z"/>
    <ellipse cx="35" cy="45" rx="18" ry="20" transform="rotate(-30 35 45)"/>
    <ellipse cx="65" cy="45" rx="18" ry="20" transform="rotate(30 65 45)"/>
    <ellipse cx="50" cy="30" rx="18" ry="20"/>
  </svg>
);

// Four Leaf Clover (Trevo de 4 Folhas - Sorte!)
export const FourLeafClover = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 100 100" fill="currentColor" {...props}>
    <path d="M50 90c0 0-2-15-2-20c0-3 1-5 2-6c1 1 2 3 2 6c0 5-2 20-2 20z"/>
    <ellipse cx="35" cy="50" rx="16" ry="18" transform="rotate(-45 35 50)"/>
    <ellipse cx="65" cy="50" rx="16" ry="18" transform="rotate(45 65 50)"/>
    <ellipse cx="50" cy="35" rx="16" ry="18"/>
    <ellipse cx="50" cy="65" rx="16" ry="18"/>
  </svg>
);

// Irish Harp (Harpa Irlandesa)
export const HarpIcon = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 60 80" fill="currentColor" {...props}>
    <path d="M30 5C15 5 5 25 5 45C5 55 10 65 20 70L20 75L40 75L40 70C50 65 55 55 55 45C55 25 45 5 30 5ZM30 15C35 15 40 30 40 45C40 50 38 55 35 58L35 65L25 65L25 58C22 55 20 50 20 45C20 30 25 15 30 15Z"/>
    <line x1="25" y1="25" x2="25" y2="60" stroke="currentColor" strokeWidth="1"/>
    <line x1="30" y1="20" x2="30" y2="62" stroke="currentColor" strokeWidth="1"/>
    <line x1="35" y1="25" x2="35" y2="60" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

// Celtic Knot (Nó Celta)
export const CelticKnot = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" {...props}>
    <circle cx="50" cy="50" r="35"/>
    <path d="M50 15 Q80 50 50 85 Q20 50 50 15"/>
    <path d="M15 50 Q50 20 85 50 Q50 80 15 50"/>
  </svg>
);

// Celtic Border Pattern
export const CelticBorder = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 400 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M0 10 Q25 0 50 10 T100 10 T150 10 T200 10 T250 10 T300 10 T350 10 T400 10"/>
    <path d="M0 10 Q25 20 50 10 T100 10 T150 10 T200 10 T250 10 T300 10 T350 10 T400 10"/>
  </svg>
);

// Dublin Skyline
export const DublinSkyline = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 400 100" fill="currentColor" {...props}>
    {/* Spire */}
    <path d="M200 0L202 80H198L200 0Z"/>
    {/* Buildings */}
    <rect x="20" y="50" width="30" height="50"/>
    <rect x="55" y="40" width="25" height="60"/>
    <rect x="85" y="55" width="20" height="45"/>
    <rect x="110" y="35" width="35" height="65"/>
    <rect x="150" y="45" width="25" height="55"/>
    {/* Ha'penny Bridge */}
    <path d="M230 80 Q260 60 290 80" fill="none" stroke="currentColor" strokeWidth="3"/>
    {/* More buildings */}
    <rect x="300" y="40" width="30" height="60"/>
    <rect x="335" y="50" width="25" height="50"/>
    <rect x="365" y="35" width="35" height="65"/>
  </svg>
);

// Ha'penny Bridge Icon
export const HapennyBridge = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="3" {...props}>
    <path d="M10 50 Q50 10 90 50"/>
    <line x1="10" y1="50" x2="10" y2="60"/>
    <line x1="90" y1="50" x2="90" y2="60"/>
    <line x1="30" y1="32" x2="30" y2="50"/>
    <line x1="50" y1="20" x2="50" y2="50"/>
    <line x1="70" y1="32" x2="70" y2="50"/>
  </svg>
);

// Wave Pattern for Section Transitions
export const WavePattern = ({ className, flip, ...props }) => (
  <svg 
    className={className} 
    viewBox="0 0 1440 120" 
    fill="currentColor" 
    preserveAspectRatio="none"
    style={flip ? { transform: 'rotate(180deg)' } : {}}
    {...props}
  >
    <path d="M0 120L60 105C120 90 240 60 360 50C480 40 600 50 720 60C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H0Z" fillOpacity="1"/>
    <path d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 80 1380 80L1440 80V120H0Z" fillOpacity="0.5"/>
  </svg>
);

// Irish Flag Colors Bar
export const IrishFlagBar = ({ className, ...props }) => (
  <div className={`flex overflow-hidden ${className}`} {...props}>
    <div className="flex-1 bg-emerald-500"></div>
    <div className="flex-1 bg-white"></div>
    <div className="flex-1 bg-amber-500"></div>
  </div>
);

// Round Tower (Torre Redonda - Monumento Irlandês)
export const RoundTower = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 40 100" fill="currentColor" {...props}>
    <path d="M20 0 L30 10 L30 90 L10 90 L10 10 Z"/>
    <rect x="15" y="70" width="10" height="15" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="20" cy="5" r="8" fill="currentColor"/>
  </svg>
);

// Leprechaun Hat
export const LeprechaunHat = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 100 80" fill="currentColor" {...props}>
    <rect x="10" y="60" width="80" height="15" rx="3"/>
    <path d="M25 60 L25 20 Q50 10 75 20 L75 60 Z"/>
    <rect x="35" y="35" width="30" height="10" fill="#FFB800"/>
    <rect x="45" y="33" width="10" height="14" fill="#FFB800"/>
  </svg>
);

// Rainbow (Arco-íris)
export const RainbowArch = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 200 100" fill="none" strokeWidth="8" {...props}>
    <path d="M10 100 Q100 -20 190 100" stroke="#FF0000"/>
    <path d="M25 100 Q100 0 175 100" stroke="#FF7F00"/>
    <path d="M40 100 Q100 20 160 100" stroke="#FFFF00"/>
    <path d="M55 100 Q100 40 145 100" stroke="#00FF00"/>
    <path d="M70 100 Q100 55 130 100" stroke="#0000FF"/>
    <path d="M85 100 Q100 70 115 100" stroke="#8B00FF"/>
  </svg>
);

// Cliffs of Moher Silhouette
export const CliffsOfMoher = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 300 100" fill="currentColor" {...props}>
    <path d="M0 100 L0 60 L30 55 L50 70 L80 40 L100 50 L130 30 L150 45 L180 25 L200 35 L230 20 L260 40 L280 30 L300 50 L300 100 Z"/>
  </svg>
);

// Sheep (Ovelha - Muito Irlandês!)
export const SheepIcon = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 60 50" fill="currentColor" {...props}>
    <ellipse cx="30" cy="30" rx="20" ry="15"/>
    <circle cx="15" cy="28" r="8"/>
    <circle cx="45" cy="28" r="8"/>
    <circle cx="25" cy="20" r="8"/>
    <circle cx="35" cy="20" r="8"/>
    <circle cx="30" cy="35" r="8"/>
    <ellipse cx="10" cy="25" rx="6" ry="8"/>
    <circle cx="8" cy="22" r="2" fill="black"/>
    <line x1="15" y1="45" x2="15" y2="50" stroke="currentColor" strokeWidth="3"/>
    <line x1="25" y1="45" x2="25" y2="50" stroke="currentColor" strokeWidth="3"/>
    <line x1="35" y1="45" x2="35" y2="50" stroke="currentColor" strokeWidth="3"/>
    <line x1="45" y1="45" x2="45" y2="50" stroke="currentColor" strokeWidth="3"/>
  </svg>
);

// Guinness Pint Glass
export const GuinnessGlass = ({ className, ...props }) => (
  <svg className={className} viewBox="0 0 40 60" fill="currentColor" {...props}>
    <path d="M5 10 L8 55 Q20 58 32 55 L35 10 Q20 8 5 10Z" fill="#1a1a1a"/>
    <ellipse cx="20" cy="10" rx="15" ry="3" fill="#1a1a1a"/>
    <ellipse cx="20" cy="15" rx="14" ry="3" fill="#F5DEB3"/>
    <path d="M35 20 Q45 25 45 35 Q45 45 35 50" fill="none" stroke="currentColor" strokeWidth="4"/>
  </svg>
);

// Decorative Irish Corner
export const IrishCorner = ({ className, position = 'top-left', ...props }) => {
  const rotations = {
    'top-left': '',
    'top-right': 'scale(-1, 1)',
    'bottom-left': 'scale(1, -1)',
    'bottom-right': 'scale(-1, -1)'
  };
  
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="currentColor"
      style={{ transform: rotations[position] }}
      {...props}
    >
      <path d="M0 0 L30 0 Q20 10 20 20 L20 30 Q10 30 0 30 Z" fillOpacity="0.3"/>
      <ShamrockIcon className="w-8 h-8" style={{ position: 'absolute', top: 5, left: 5 }}/>
    </svg>
  );
};

// Page Header Component with Irish Theme
export const IrishPageHeader = ({ 
  title, 
  subtitle, 
  badge,
  children,
  className = ''
}) => (
  <div className={`relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 overflow-hidden ${className}`}>
    {/* Decorative Elements */}
    <div className="absolute inset-0 overflow-hidden">
      <ShamrockIcon className="absolute -top-10 -left-10 w-48 h-48 text-emerald-700/20 rotate-12" />
      <ShamrockIcon className="absolute top-20 right-10 w-32 h-32 text-emerald-600/10 -rotate-12" />
      <HarpIcon className="absolute bottom-10 right-20 w-24 h-32 text-amber-500/10" />
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
    </div>

    <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20">
      {badge && (
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-emerald-200 text-sm mb-6">
          <ShamrockIcon className="h-4 w-4" />
          {badge}
        </div>
      )}
      
      <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
        {title}
      </h1>
      
      {subtitle && (
        <p className="text-lg text-emerald-100/90 max-w-2xl">
          {subtitle}
        </p>
      )}
      
      {children}
    </div>

    {/* Wave Transition */}
    <WavePattern className="absolute bottom-0 left-0 right-0 text-white h-16" />
  </div>
);

// Irish Stats Card
export const IrishStatsCard = ({ icon: Icon, value, label, className = '' }) => (
  <div className={`text-center group ${className}`}>
    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
      <Icon className="h-8 w-8 text-white" />
    </div>
    <p className="text-3xl font-bold text-amber-500">{value}</p>
    <p className="text-gray-600 text-sm">{label}</p>
  </div>
);

// Irish Section Wrapper
export const IrishSection = ({ 
  children, 
  className = '', 
  withShamrocks = true,
  bgColor = 'bg-white'
}) => (
  <section className={`relative overflow-hidden ${bgColor} ${className}`}>
    {withShamrocks && (
      <>
        <ShamrockIcon className="absolute top-10 left-10 w-32 h-32 text-emerald-100/30 rotate-12" />
        <ShamrockIcon className="absolute bottom-10 right-10 w-24 h-24 text-emerald-100/30 -rotate-12" />
      </>
    )}
    <div className="relative">
      {children}
    </div>
  </section>
);

export default {
  ShamrockIcon,
  FourLeafClover,
  HarpIcon,
  CelticKnot,
  CelticBorder,
  DublinSkyline,
  HapennyBridge,
  WavePattern,
  IrishFlagBar,
  RoundTower,
  LeprechaunHat,
  RainbowArch,
  CliffsOfMoher,
  SheepIcon,
  GuinnessGlass,
  IrishCorner,
  IrishPageHeader,
  IrishStatsCard,
  IrishSection
};
