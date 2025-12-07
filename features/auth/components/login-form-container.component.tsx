import { ReactNode } from 'react';

interface LoginFormContainerProps {
  children: ReactNode;
}

/**
 * Container for login form cards
 * Provides relative positioning for animated step cards
 */
export function LoginFormContainer({ children }: LoginFormContainerProps) {
  return (
    <div className="relative w-full max-w-md card-enter -mt-[100px]">
      {children}
    </div>
  );
}

