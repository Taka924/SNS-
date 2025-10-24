
import React from 'react';

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "処理中..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-lg shadow-xl">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-sky-500"></div>
      <p className="mt-4 text-sky-300">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
