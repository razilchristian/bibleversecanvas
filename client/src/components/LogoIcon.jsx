import React from 'react';
import { cn } from '../utils/cn';

export default function LogoIcon({ className, size = 32, strokeWidth = 1.5, ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* Soft Circular/Rounded-Square Outline */}
      <rect x="2" y="2" width="20" height="20" rx="6" />
      
      {/* Cross in the top half */}
      <path d="M12 5v7" />
      <path d="M9.5 7.5h5" />
      
      {/* Bible/Book Open at the bottom half */}
      <path d="M6 16.5A2.5 2.5 0 0 1 8.5 14h3.5v5H8.5A2.5 2.5 0 0 1 6 16.5z" />
      <path d="M18 16.5A2.5 2.5 0 0 0 15.5 14h-3.5v5h3.5a2.5 2.5 0 0 0 2.5-2.5z" />
    </svg>
  );
}
