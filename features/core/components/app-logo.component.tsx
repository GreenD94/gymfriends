type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface LogoSizeConfig {
  container: string;
  image: string;
}

const LOGO_SIZES: Record<LogoSize, LogoSizeConfig> = {
  xs: {
    container: 'h-12 w-12',
    image: 'h-10 w-10',
  },
  sm: {
    container: 'h-16 w-16',
    image: 'h-14 w-14',
  },
  md: {
    container: 'h-20 w-20',
    image: 'h-16 w-16',
  },
  lg: {
    container: 'h-24 w-24',
    image: 'h-20 w-20',
  },
  xl: {
    container: 'h-32 w-32',
    image: 'h-28 w-28',
  },
  '2xl': {
    container: 'h-40 w-40',
    image: 'h-36 w-36',
  },
};

interface AppLogoProps {
  size?: LogoSize;
  className?: string;
}

export function AppLogo({ size = 'md', className = '' }: AppLogoProps) {
  const sizeConfig = LOGO_SIZES[size];

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .logo-animate {
          animation: slideInFromRight 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      <img 
        src="/logo.png" 
        alt="Gym Friends Logo" 
        className={`logo-animate rounded-full object-cover ${sizeConfig.image} ${className}`}
      />
    </>
  );
}

