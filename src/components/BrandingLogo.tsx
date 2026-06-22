import React from "react";

interface BrandingLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export default function BrandingLogo({ className = "", size = "md", showText = true }: BrandingLogoProps) {
  const sizeMap = {
    sm: { svg: "h-8 w-8", text: "text-lg", sub: "text-[7px]", logoOnly: false },
    md: { svg: "h-8 w-8 md:h-11 md:w-11", text: "text-lg md:text-xl lg:text-2xl", sub: "text-[10px]", logoOnly: false },
    lg: { svg: "h-16 w-16 md:h-24 md:w-24", text: "text-3xl md:text-4xl", sub: "text-xs", logoOnly: false },
    xl: { svg: "h-32 w-32 md:h-48 md:w-48", text: "text-5xl md:text-6xl", sub: "text-md", logoOnly: true }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2 md:gap-3 ${className}`}>
      {/* SVG Icon recreating the overlapping, gradient-filled KN with Tech Nodes */}
      <svg
        className={`${currentSize.svg} filter drop-shadow-[0_0_15px_rgba(37,99,235,0.35)] select-none shrink-0`}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        id="korenexus-logo-svg"
      >
        <defs>
          {/* Logo Gradients */}
          <linearGradient id="purpleGradient" x1="125" y1="100" x2="250" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="blueGradient" x1="250" y1="140" x2="400" y2="350" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="connectorGradient" x1="150" y1="200" x2="350" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          
          {/* Subtle Glow Filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Tech Grids helper */}
        <circle cx="250" cy="250" r="235" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="5 5" />
        <circle cx="250" cy="250" r="180" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />

        {/* Stem of the 'K' with rounded corners */}
        <rect
          x="125"
          y="100"
          width="48"
          height="300"
          rx="24"
          fill="url(#purpleGradient)"
        />

        {/* Upper diagonal of the 'K' */}
        <path
          d="M 160 210 L 260 110 C 275 95, 305 95, 320 110 C 335 125, 335 155, 320 170 L 210 280 Z"
          fill="url(#purpleGradient)"
        />

        {/* Lower diagonal of the 'K' */}
        <path
          d="M 162 260 L 285 385 C 298 398, 320 398, 333 385 C 346 372, 346 350, 333 337 L 218 222 Z"
          fill="url(#purpleGradient)"
        />

        {/* Dynamic, looping connector mimicking network circuits (Glow style) */}
        <path
          d="M 215 280 C 230 250, 270 170, 310 200 C 340 220, 280 280, 340 310"
          stroke="url(#connectorGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Stem of the 'N' */}
        <rect
          x="350"
          y="140"
          width="48"
          height="220"
          rx="24"
          fill="url(#blueGradient)"
        />

        {/* Diagonal of the 'N' routing downward */}
        <path
          d="M 270 185 C 270 155, 300 135, 325 155 L 374 240 L 374 350 L 325 350 Z"
          fill="url(#blueGradient)"
          opacity="0.95"
        />

        {/* Tech dots/connections recreating specific nodes in key intersection coordinates */}
        <circle cx="215" cy="280" r="14" fill="#FFFFFF" filter="url(#glow)" />
        <circle cx="215" cy="280" r="8" fill="#7C3AED" />

        <circle cx="270" cy="185" r="14" fill="#FFFFFF" filter="url(#glow)" />
        <circle cx="270" cy="185" r="8" fill="#3B82F6" />

        <circle cx="340" cy="310" r="14" fill="#FFFFFF" filter="url(#glow)" />
        <circle cx="340" cy="310" r="8" fill="#06B6D4" />
      </svg>

      {showText && (
        <div className="flex flex-col select-none min-w-0">
          <span className={`font-display font-black tracking-wider text-white ${currentSize.text}`}>
            <span className="bg-gradient-to-r from-[#A855F7] to-[#7C3AED] bg-clip-text text-transparent">KORE</span>
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">NEXUS</span>
          </span>
          
          {/* Thin separator line with center dot */}
          <div className="hidden sm:flex items-center gap-1.5 w-full my-0.5 opacity-80">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#7C3AED]/40"></div>
            <div className="w-1 h-1 rounded-full bg-[#7C3AED] shrink-0"></div>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-[#3B82F6]/40 to-transparent"></div>
          </div>

          <span className={`hidden sm:block font-sans tracking-widest text-[#94a3b8] uppercase font-bold leading-tight ${currentSize.sub}`}>
            Desenvolvimento de Software Sob Medida
          </span>
        </div>
      )}
    </div>
  );
}
