import { ThemeConfig } from '../themes/theme.types';

type TitleSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface TitleSizeConfig {
  textSize: string;
  lineHeight: string;
}

const TITLE_SIZES: Record<TitleSize, TitleSizeConfig> = {
  sm: {
    textSize: 'text-2xl',
    lineHeight: 'leading-tight',
  },
  md: {
    textSize: 'text-3xl',
    lineHeight: 'leading-tight',
  },
  lg: {
    textSize: 'text-4xl',
    lineHeight: 'leading-tight',
  },
  xl: {
    textSize: 'text-5xl',
    lineHeight: 'leading-tight',
  },
  '2xl': {
    textSize: 'text-6xl',
    lineHeight: 'leading-tight',
  },
};

interface AppTitleProps {
  theme: ThemeConfig;
  size?: TitleSize;
  className?: string;
}

export function AppTitle({ theme, size = 'xl', className = '' }: AppTitleProps) {
  const sizeConfig = TITLE_SIZES[size];

  // Split words into letters
  const word1 = 'GYM';
  const word2 = 'FRIENDS';

  // Animation delay per letter (in seconds)
  const getLetterDelay = (index: number, wordIndex: number) => {
    const baseDelay = wordIndex * 0.3; // Delay between words
    return baseDelay + index * 0.1; // 0.1s delay between each letter
  };

  return (
    <>
      <style jsx>{`
        @keyframes fallIn {
          from {
            opacity: 0;
            transform: translateY(-100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .letter-animate {
          display: inline-block;
          animation: fallIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      <h1 
        className={`${sizeConfig.textSize} font-black uppercase ${sizeConfig.lineHeight} tracking-tight ${theme.classes.titleColor} ${className}`}
        style={{ fontFamily: 'Arial Black, sans-serif' }}
      >
        <span className="block whitespace-nowrap">
          {word1.split('').map((letter, index) => (
            <span
              key={`letter-1-${index}`}
              className="letter-animate"
              style={{
                animationDelay: `${getLetterDelay(index, 0)}s`,
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </span>
        <span className="block whitespace-nowrap">
          {word2.split('').map((letter, index) => (
            <span
              key={`letter-2-${index}`}
              className="letter-animate"
              style={{
                animationDelay: `${getLetterDelay(index, 1)}s`,
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </span>
      </h1>
    </>
  );
}

