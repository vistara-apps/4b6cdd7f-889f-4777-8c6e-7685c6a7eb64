'use client';

import React from 'react';
import { Button } from './ui/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { Loader2 } from 'lucide-react';

const actionButtonVariants = cva(
  "transition-all duration-200 font-medium",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl",
        secondary: "bg-accent hover:bg-accent/90 text-white",
        icon: "w-10 h-10 p-0",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-sm",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionButtonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function ActionButton({
  className,
  variant,
  size,
  children,
  loading = false,
  icon,
  disabled,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      className={cn(actionButtonVariants({ variant, size, className }))}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </Button>
  );
}
