// src/components/ui/Button.js

import React from 'react';

function Button({ children, onClick, variant = 'default', size = 'md', className = '', ...props }) {
  const baseStyle =
    'inline-flex items-center justify-center border font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    default:
      'bg-blue-600 text-white border-transparent hover:bg-blue-700 focus:ring-blue-500',
    outline:
      'bg-transparent text-white border-gray-600 hover:bg-gray-800 focus:ring-gray-500',
    link: 'text-blue-500 hover:underline focus:ring-blue-500',
    destructive:
      'bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500',
    success:
      'bg-green-600 text-white border-transparent hover:bg-green-700 focus:ring-green-500',
  };
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    icon: 'p-2',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
