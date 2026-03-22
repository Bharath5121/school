import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'primary';
  children: React.ReactNode;
}

export const Button = ({ children, variant = 'default', className, ...props }: ButtonProps) => (
  <button className={className} data-variant={variant} {...props}>
    {children}
  </button>
);
