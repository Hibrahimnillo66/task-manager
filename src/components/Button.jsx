// components/Button.js
import React from 'react';

const Button = ({ onClick, children, className, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md transition duration-200 bg-gray-700 text-white hover:bg-gray-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
