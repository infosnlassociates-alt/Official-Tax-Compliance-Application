import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: 'fabric' | 'wood';
  customImageUrl?: string | null;
}

export const ShreeNavyaLekhaLogo: React.FC<LogoProps> = ({ 
  className = "w-10 h-10", 
  size = 48,
  showText = false,
  variant = 'fabric',
  customImageUrl = null
}) => {
  const isWood = variant === 'wood';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {customImageUrl ? (
        <div 
          style={{ width: size, height: size }}
          className="relative rounded-full overflow-hidden shrink-0 border-2 border-amber-400 shadow-md p-0.5 bg-gradient-to-tr from-amber-600 via-amber-200 to-amber-700 transition-transform hover:scale-105 duration-200"
        >
          <img 
            src={customImageUrl} 
            alt="Firm Logo" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      ) : (
        /* Transparent Circular Embroidered Seal / 3D Wood Plaque */
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 drop-shadow-lg transition-transform hover:scale-105 duration-200"
        >
        <defs>
          {/* Circular Clipping Path for Transparency */}
          <clipPath id={`circleClip-${variant}`}>
            <circle cx="100" cy="100" r="97" />
          </clipPath>

          {/* Golden Thread / Polished Brass Gradient */}
          <linearGradient id={`goldGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fae59a" />
            <stop offset="25%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#fff6b3" />
            <stop offset="75%" stopColor="#b38927" />
            <stop offset="100%" stopColor="#7a550d" />
          </linearGradient>

          {/* Brass Bevel Rim Gradient */}
          <linearGradient id={`brassRim-${variant}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#fae188" />
            <stop offset="20%" stopColor="#c59935" />
            <stop offset="50%" stopColor="#fff3ad" />
            <stop offset="80%" stopColor="#8c6218" />
            <stop offset="100%" stopColor="#e2bc55" />
          </linearGradient>

          {/* Rich Polished Teak / Walnut Wood Pattern */}
          <radialGradient id={`woodBase-${variant}`} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#693b16" />
            <stop offset="45%" stopColor="#4f270d" />
            <stop offset="75%" stopColor="#3b1c09" />
            <stop offset="100%" stopColor="#241005" />
          </radialGradient>

          {/* Center Bronze Sunburst Gradient */}
          <radialGradient id={`centerBronze-${variant}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8c5828" />
            <stop offset="70%" stopColor="#5a3411" />
            <stop offset="100%" stopColor="#3d2109" />
          </radialGradient>

          {/* Navy Blue Fabric Gradient */}
          <radialGradient id={`navyFabric-${variant}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a2f57" />
            <stop offset="60%" stopColor="#111f3b" />
            <stop offset="100%" stopColor="#0b1529" />
          </radialGradient>

          {/* Text Paths */}
          <path id={`topTextArc-${variant}`} d="M 27 100 A 73 73 0 0 1 173 100" fill="none" />
          <path id={`innerLeftArc-${variant}`} d="M 52 100 A 48 48 0 0 1 100 52" fill="none" />
          <path id={`innerRightArc-${variant}`} d="M 100 52 A 48 48 0 0 1 148 100" fill="none" />
          <path id={`bottomTextArc-${variant}`} d="M 173 102 A 73 73 0 0 1 27 102" fill="none" />
          <path id={`mottoTextArc-${variant}`} d="M 152 104 A 52 52 0 0 1 48 104" fill="none" />
        </defs>

        {/* Group with Circular Clip for 100% Transparent Outer Boundary */}
        <g clipPath={`url(#circleClip-${variant})`}>
          {/* Base Material: Wood or Navy Blue Fabric */}
          <circle 
            cx="100" 
            cy="100" 
            r="97" 
            fill={isWood ? `url(#woodBase-${variant})` : `url(#navyFabric-${variant})`} 
          />

          {/* Subtle Woodgrain Streaks if Wood variant */}
          {isWood && (
            <g opacity="0.18" stroke="#000" strokeWidth="1">
              <line x1="30" y1="20" x2="170" y2="25" />
              <line x1="20" y1="60" x2="180" y2="65" />
              <line x1="15" y1="100" x2="185" y2="98" />
              <line x1="25" y1="140" x2="175" y2="142" />
              <line x1="40" y1="175" x2="160" y2="172" />
            </g>
          )}

          {/* Outer Beveled Brass / Gold Trim */}
          <circle 
            cx="100" 
            cy="100" 
            r="93.5" 
            stroke={`url(#brassRim-${variant})`} 
            strokeWidth={isWood ? "7" : "6"} 
            strokeDasharray={isWood ? undefined : "4 2"} 
          />
          <circle 
            cx="100" 
            cy="100" 
            r={isWood ? "89.5" : "89"} 
            stroke={isWood ? "#241005" : "#5a3d0f"} 
            strokeWidth="1.5" 
          />

          {/* Inner Golden Ring separating Ring from Center */}
          <circle 
            cx="100" 
            cy="100" 
            r="54" 
            fill={`url(#centerBronze-${variant})`} 
            stroke={`url(#goldGradient-${variant})`} 
            strokeWidth="3.5" 
          />

          {/* Text: Devanagari Hindi Upper Arc */}
          <text 
            fill={`url(#goldGradient-${variant})`} 
            fontSize="12" 
            fontWeight="bold" 
            letterSpacing="0.8"
            style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.8))' }}
          >
            <textPath href={`#topTextArc-${variant}`} startOffset="50%" textAnchor="middle">
              श्री नव्य लेखा एसोसिएट्स
            </textPath>
          </text>

          {/* Text: English Lower Arc */}
          <text 
            fill={isWood ? `url(#goldGradient-${variant})` : "#ffffff"} 
            fontSize="10" 
            fontWeight="bold" 
            letterSpacing="1"
            style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.8))' }}
          >
            <textPath href={`#bottomTextArc-${variant}`} startOffset="50%" textAnchor="middle">
              SHRI NAVYA LEKHA ASSOCIATES
            </textPath>
          </text>

          {/* Center: Radiant Sunburst Rays */}
          <g transform="translate(100, 88)" stroke={`url(#goldGradient-${variant})`} strokeWidth="2.5" strokeLinecap="round">
            {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg) => (
              <line 
                key={deg} 
                x1="0" 
                y1="-20" 
                x2="0" 
                y2="-27" 
                transform={`rotate(${deg})`} 
              />
            ))}
          </g>

          {/* Center: Majestic Lion Head Silhouette */}
          <path
            d="M 100 70 
               C 94 70 90 74 88 80 
               C 86 85 88 91 92 94 
               C 95 96 98 97 100 97 
               C 102 97 105 96 108 94 
               C 112 91 114 85 112 80 
               C 110 74 106 70 100 70 Z
               M 96 79 Q 98 77 100 77 Q 102 77 104 79
               M 95 83 A 1.5 1.5 0 1 1 95 80 A 1.5 1.5 0 1 1 95 83
               M 105 83 A 1.5 1.5 0 1 1 105 80 A 1.5 1.5 0 1 1 105 83
               M 98 88 Q 100 90 102 88"
            fill={`url(#goldGradient-${variant})`}
            style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.7))' }}
          />

          {/* Center: Open Ledger / Book of Accounts */}
          <g transform="translate(75, 96)">
            {/* Left Page */}
            <path
              d="M 25 3 Q 12 0 0 4 L 0 25 Q 12 21 25 24 Z"
              fill={isWood ? "#f5e6c8" : "#fff8e7"}
              stroke={`url(#goldGradient-${variant})`}
              strokeWidth="1.5"
            />
            {/* Right Page */}
            <path
              d="M 25 3 Q 38 0 50 4 L 50 25 Q 38 21 25 24 Z"
              fill={isWood ? "#f5e6c8" : "#fff8e7"}
              stroke={`url(#goldGradient-${variant})`}
              strokeWidth="1.5"
            />
            {/* Ledger lines on pages */}
            <line x1="4" y1="9" x2="20" y2="8" stroke="#b08b35" strokeWidth="0.8" />
            <line x1="4" y1="14" x2="20" y2="13" stroke="#b08b35" strokeWidth="0.8" />
            <line x1="4" y1="19" x2="20" y2="18" stroke="#b08b35" strokeWidth="0.8" />

            <line x1="30" y1="8" x2="46" y2="9" stroke="#b08b35" strokeWidth="0.8" />
            <line x1="30" y1="13" x2="46" y2="14" stroke="#b08b35" strokeWidth="0.8" />
            <line x1="30" y1="18" x2="46" y2="19" stroke="#b08b35" strokeWidth="0.8" />
          </g>

          {/* Golden Writing Quill Pen Crossing the Book */}
          <path
            d="M 118 95
               C 126 102 128 114 116 126
               C 114 128 108 132 94 135
               C 99 127 106 120 111 114
               C 115 109 116 102 118 95 Z"
            fill={`url(#goldGradient-${variant})`}
            stroke="#785312"
            strokeWidth="0.8"
            style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.8))' }}
          />

          {/* Hindi Motto under the book */}
          <text 
            fill={`url(#goldGradient-${variant})`} 
            fontSize="6.2" 
            fontWeight="bold" 
            letterSpacing="0.4"
            style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.9))' }}
          >
            <textPath href={`#mottoTextArc-${variant}`} startOffset="50%" textAnchor="middle">
              विश्वास की नींव, प्रगति का आधार
            </textPath>
          </text>

          {/* Inner Highlight Ring */}
          <circle 
            cx="100" 
            cy="100" 
            r="94" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="0.75" 
            strokeDasharray={isWood ? undefined : "2 2"} 
          />
        </g>
      </svg>
      )}

      {/* Optional Side Wordmark */}
      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            Shri Navya Lekha
          </span>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold tracking-wider uppercase">
            Associates · Tax & Audit
          </span>
        </div>
      )}
    </div>
  );
};
