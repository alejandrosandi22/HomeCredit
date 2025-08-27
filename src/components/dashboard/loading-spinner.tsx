import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = 'medium',
  text = 'Loading...',
  className = '',
}: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-4 w-4';
      case 'large':
        return 'h-8 w-8';
      default:
        return 'h-6 w-6';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <Loader2 className={`animate-spin text-blue-600 ${getSizeClasses()}`} />
      {text && (
        <p className={`font-medium text-gray-600 ${getTextSize()}`}>{text}</p>
      )}
    </div>
  );
}
