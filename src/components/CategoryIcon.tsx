interface CategoryIconProps {
  type: "music" | "code" | "art" | "language" | "fitness" | "cooking";
  className?: string;
}

const CategoryIcon = ({ type, className = "w-16 h-16" }: CategoryIconProps) => {
  const icons: Record<string, JSX.Element> = {
    music: (
      <svg viewBox="0 0 64 64" fill="none" className={className}>
        <circle cx="32" cy="32" r="30" fill="hsl(152 60% 42% / 0.15)" />
        <path d="M24 44V20L44 16V40" stroke="hsl(152 60% 42%)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="20" cy="44" r="6" fill="hsl(152 60% 42%)" />
        <circle cx="40" cy="40" r="6" fill="hsl(80 65% 55%)" />
      </svg>
    ),
    code: (
      <svg viewBox="0 0 64 64" fill="none" className={className}>
        <circle cx="32" cy="32" r="30" fill="hsl(152 60% 42% / 0.15)" />
        <path d="M24 22L14 32L24 42" stroke="hsl(152 60% 42%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 22L50 32L40 42" stroke="hsl(80 65% 55%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M36 18L28 46" stroke="hsl(152 60% 42% / 0.5)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    art: (
      <svg viewBox="0 0 64 64" fill="none" className={className}>
        <circle cx="32" cy="32" r="30" fill="hsl(152 60% 42% / 0.15)" />
        <path d="M32 16C22 16 16 24 16 32C16 40 22 46 28 46C30 46 30 42 32 42C34 42 34 46 36 46C42 46 48 40 48 32C48 24 42 16 32 16Z" stroke="hsl(152 60% 42%)" strokeWidth="2.5" fill="none" />
        <circle cx="26" cy="28" r="3" fill="hsl(0 70% 60%)" />
        <circle cx="34" cy="24" r="3" fill="hsl(80 65% 55%)" />
        <circle cx="40" cy="30" r="3" fill="hsl(200 70% 55%)" />
        <circle cx="28" cy="36" r="3" fill="hsl(45 80% 55%)" />
      </svg>
    ),
    language: (
      <svg viewBox="0 0 64 64" fill="none" className={className}>
        <circle cx="32" cy="32" r="30" fill="hsl(152 60% 42% / 0.15)" />
        <circle cx="26" cy="30" r="12" stroke="hsl(152 60% 42%)" strokeWidth="2.5" fill="none" />
        <circle cx="38" cy="34" r="12" stroke="hsl(80 65% 55%)" strokeWidth="2.5" fill="none" />
        <text x="21" y="34" fontSize="10" fill="hsl(152 60% 42%)" fontFamily="DM Sans" fontWeight="600">A</text>
        <text x="38" y="38" fontSize="10" fill="hsl(80 65% 55%)" fontFamily="DM Sans" fontWeight="600">あ</text>
      </svg>
    ),
    fitness: (
      <svg viewBox="0 0 64 64" fill="none" className={className}>
        <circle cx="32" cy="32" r="30" fill="hsl(152 60% 42% / 0.15)" />
        <rect x="10" y="28" width="8" height="8" rx="2" fill="hsl(80 65% 55%)" />
        <rect x="46" y="28" width="8" height="8" rx="2" fill="hsl(80 65% 55%)" />
        <rect x="16" y="26" width="6" height="12" rx="2" fill="hsl(152 60% 42%)" />
        <rect x="42" y="26" width="6" height="12" rx="2" fill="hsl(152 60% 42%)" />
        <rect x="22" y="30" width="20" height="4" rx="2" fill="hsl(152 60% 42%)" />
      </svg>
    ),
    cooking: (
      <svg viewBox="0 0 64 64" fill="none" className={className}>
        <circle cx="32" cy="32" r="30" fill="hsl(152 60% 42% / 0.15)" />
        <path d="M20 40 Q32 48 44 40" stroke="hsl(152 60% 42%)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="18" y="36" width="28" height="4" rx="2" fill="hsl(152 60% 42%)" />
        <path d="M26 36V28" stroke="hsl(80 65% 55%)" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 36V24" stroke="hsl(80 65% 55%)" strokeWidth="2" strokeLinecap="round" />
        <path d="M38 36V28" stroke="hsl(80 65% 55%)" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 24 Q26 20 28 24" stroke="hsl(152 60% 42% / 0.4)" strokeWidth="1.5" fill="none" />
        <path d="M30 20 Q32 16 34 20" stroke="hsl(152 60% 42% / 0.4)" strokeWidth="1.5" fill="none" />
        <path d="M36 24 Q38 20 40 24" stroke="hsl(152 60% 42% / 0.4)" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  };

  return icons[type] || null;
};

export default CategoryIcon;
