// src/components/ui/Alert.js

import React from 'react';

function Alert({ children, variant = 'default', className = '', ...props }) {
  const baseStyle = 'p-4 rounded-md';
  const variants = {
    default: 'bg-blue-100 text-blue-700',
    destructive: 'bg-red-100 text-red-700',
  };

  return (
    <div className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Alert;
