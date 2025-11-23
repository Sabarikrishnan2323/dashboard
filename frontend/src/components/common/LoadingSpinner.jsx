import React from 'react';

const LoadingSpinner = ({ size = 'large', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div 
        className={`
          animate-spin rounded-full 
          border-gray-300 border-t-blue-600 
          ${sizeClasses[size]}
        `}
      ></div>
      {text && (
        <p className="mt-4 text-gray-600 font-medium text-sm">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;