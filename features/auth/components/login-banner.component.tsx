interface LoginBannerProps {
  src: string;
  alt?: string;
  className?: string;
}

export function LoginBanner({ 
  src, 
  alt = 'Login Banner', 
  className = '' 
}: LoginBannerProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full m-2 object-cover rounded-2xl shadow-xl ${className}`}
    />
  );
}

