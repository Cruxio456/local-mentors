const HeroIllustration = () => (
  <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    {/* Background circles */}
    <circle cx="250" cy="200" r="160" fill="hsl(152 60% 42% / 0.08)" />
    <circle cx="250" cy="200" r="120" fill="hsl(152 60% 42% / 0.06)" />
    
    {/* Desk */}
    <rect x="120" y="260" rx="8" width="260" height="12" fill="hsl(152 30% 20%)" />
    <rect x="160" y="272" rx="4" width="8" height="60" fill="hsl(152 25% 18%)" />
    <rect x="332" y="272" rx="4" width="8" height="60" fill="hsl(152 25% 18%)" />
    
    {/* Laptop */}
    <rect x="180" y="210" rx="6" width="140" height="50" fill="hsl(152 35% 15%)" stroke="hsl(152 60% 42%)" strokeWidth="2" />
    <rect x="190" y="218" rx="2" width="120" height="34" fill="hsl(152 45% 6%)" />
    {/* Screen content - code lines */}
    <rect x="198" y="226" width="40" height="3" rx="1.5" fill="hsl(152 60% 42%)" />
    <rect x="198" y="233" width="60" height="3" rx="1.5" fill="hsl(80 65% 55% / 0.6)" />
    <rect x="198" y="240" width="30" height="3" rx="1.5" fill="hsl(152 60% 42% / 0.5)" />
    <path d="M170 260 L180 210 L320 210 L330 260 Z" fill="hsl(152 30% 18%)" />
    
    {/* Teacher person (left) */}
    <circle cx="100" cy="170" r="24" fill="hsl(30 60% 65%)" />
    <rect x="80" y="194" rx="10" width="40" height="55" fill="hsl(152 60% 42%)" />
    {/* Arm pointing */}
    <rect x="120" y="205" rx="4" width="45" height="8" fill="hsl(30 60% 65%)" transform="rotate(-15 120 205)" />
    {/* Eyes */}
    <circle cx="93" cy="167" r="2.5" fill="hsl(152 45% 6%)" />
    <circle cx="107" cy="167" r="2.5" fill="hsl(152 45% 6%)" />
    {/* Smile */}
    <path d="M93 178 Q100 184 107 178" stroke="hsl(152 45% 6%)" strokeWidth="2" fill="none" strokeLinecap="round" />
    
    {/* Student person (right) */}
    <circle cx="400" cy="180" r="22" fill="hsl(25 55% 55%)" />
    <rect x="382" y="202" rx="10" width="36" height="50" fill="hsl(80 50% 45%)" />
    {/* Notebook */}
    <rect x="375" y="230" rx="3" width="24" height="30" fill="hsl(140 20% 90%)" transform="rotate(10 375 230)" />
    <rect x="380" y="237" width="14" height="2" rx="1" fill="hsl(152 25% 50%)" transform="rotate(10 380 237)" />
    <rect x="380" y="243" width="10" height="2" rx="1" fill="hsl(152 25% 50%)" transform="rotate(10 380 243)" />
    {/* Eyes */}
    <circle cx="394" cy="177" r="2.2" fill="hsl(152 45% 6%)" />
    <circle cx="406" cy="177" r="2.2" fill="hsl(152 45% 6%)" />
    <path d="M394 186 Q400 191 406 186" stroke="hsl(152 45% 6%)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    
    {/* Knowledge sharing particles */}
    <circle cx="160" cy="160" r="4" fill="hsl(80 65% 55%)" opacity="0.7">
      <animate attributeName="cy" values="160;150;160" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="340" cy="150" r="3" fill="hsl(152 60% 42%)" opacity="0.5">
      <animate attributeName="cy" values="150;140;150" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="200" cy="140" r="5" fill="hsl(152 60% 42% / 0.4)">
      <animate attributeName="cy" values="140;128;140" dur="3.5s" repeatCount="indefinite" />
    </circle>
    
    {/* Connection line between people */}
    <path d="M130 200 Q250 130 370 200" stroke="hsl(152 60% 42%)" strokeWidth="1.5" strokeDasharray="6 4" fill="none" opacity="0.4" />
    
    {/* Book stack */}
    <rect x="60" y="250" rx="2" width="30" height="8" fill="hsl(152 60% 42%)" />
    <rect x="58" y="242" rx="2" width="34" height="8" fill="hsl(80 65% 55% / 0.7)" />
    <rect x="62" y="234" rx="2" width="28" height="8" fill="hsl(152 50% 35%)" />
    
    {/* Light bulb */}
    <circle cx="250" cy="100" r="18" fill="hsl(50 90% 60%)" opacity="0.2" />
    <circle cx="250" cy="100" r="12" fill="hsl(50 90% 60%)" opacity="0.3">
      <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite" />
    </circle>
    <path d="M244 92 L250 82 L256 92" stroke="hsl(50 90% 60%)" strokeWidth="2" fill="none" strokeLinecap="round" />
    <rect x="247" y="108" width="6" height="8" rx="2" fill="hsl(50 70% 50%)" />
  </svg>
);

export default HeroIllustration;
