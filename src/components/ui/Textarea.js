import React from 'react';

function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  );
}

export default Textarea;
