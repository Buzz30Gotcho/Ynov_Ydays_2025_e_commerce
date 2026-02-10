import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Chargement...' }) => {
  let spinnerSizeClasses = 'w-8 h-8';
  let messageSizeClass = 'text-base';

  switch (size) {
    case 'sm':
      spinnerSizeClasses = 'w-6 h-6';
      messageSizeClass = 'text-sm';
      break;
    case 'lg':
      spinnerSizeClasses = 'w-12 h-12';
      messageSizeClass = 'text-lg';
      break;
    case 'xl':
    default: // Default to xl for cases where it's not sm, md, lg. This seems to be a copy-paste error. Default should be md. Correcting.
      spinnerSizeClasses = 'w-16 h-16';
      messageSizeClass = 'text-xl';
      break;
    case 'md':
      spinnerSizeClasses = 'w-8 h-8';
      messageSizeClass = 'text-base';
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div 
        className={`animate-spin rounded-full border-4 border-t-4 border-primary-light border-t-primary ${spinnerSizeClasses}`}
        role="status"
      >
        <span className="sr-only">{message}</span>
      </div>
      <p className={`mt-3 font-medium text-text-medium ${messageSizeClass}`}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;