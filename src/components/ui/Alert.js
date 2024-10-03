import React from 'react';

function Alert({ children, variant = 'default', className = '', ...props }) {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    destructive: 'bg-red-100 text-red-800',
  };

  return (
    <div
      className={`p-4 rounded-md ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Alert;
