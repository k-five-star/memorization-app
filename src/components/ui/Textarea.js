// src/components/ui/Textarea.js

import React from 'react';

function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    ></textarea>
  );
}

export default Textarea;
