import { TextareaHTMLAttributes, forwardRef } from 'react';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`border rounded-md px-3 py-2 focus:outline-none focus:ring w-full ${className}`}
      {...props}
    />
  )
);

Textarea.displayName = 'Textarea';
