import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  textColor = 'text-white',
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', stroke: 6 },
    md: { icon: 'w-12 h-12', text: 'text-2xl', stroke: 7 },
    lg: { icon: 'w-20 h-20', text: 'text-3xl', stroke: 8 },
    xl: { icon: 'w-24 h-24', text: 'text-4xl', stroke: 9 },
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center select-none">
      {/* Stylized M Logo Icon */}
      <div className={`relative ${currentSize.icon} flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          {/* Smooth Fluid White 'M' Logo path based on Figma design */}
          <path
            d="M 22 75 C 20 50, 30 25, 42 32 C 48 35, 48 60, 50 62 C 52 60, 56 32, 64 30 C 74 27, 78 50, 78 75"
            stroke="white"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <h1 className={`font-bold tracking-tight mt-2 ${currentSize.text} ${textColor}`}>
          MoneyCare
        </h1>
      )}
    </div>
  );
};
