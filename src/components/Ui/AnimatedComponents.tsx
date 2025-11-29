'use client';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale';
  delay?: number;
  className?: string;
}

export const AnimatedSection = ({ 
  children, 
  animation = 'fade-in', 
  delay = 0,
  className = '' 
}: AnimatedSectionProps) => {
  const { elementRef, isVisible } = useScrollAnimation();

  const animationClasses = {
    'fade-in': 'opacity-0 animate-fade-in',
    'slide-up': 'opacity-0 translate-y-10 animate-slide-up',
    'slide-left': 'opacity-0 translate-x-10 animate-slide-left',
    'slide-right': 'opacity-0 -translate-x-10 animate-slide-right',
    'scale': 'opacity-0 scale-95 animate-scale-in'
  };

  return (
    <div
      ref={elementRef}
      className={`${className} ${isVisible ? animationClasses[animation] : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveTable = ({ children, className = '' }: ResponsiveTableProps) => {
  return (
    <div className={`w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 ${className}`}>
      <div className="min-w-[640px] sm:min-w-full">
        {children}
      </div>
    </div>
  );
};
