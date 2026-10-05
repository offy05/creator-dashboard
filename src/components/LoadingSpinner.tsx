import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading content...' }) => {
  return (
    <div className="loading-state" role="status">
      <div className="spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};
