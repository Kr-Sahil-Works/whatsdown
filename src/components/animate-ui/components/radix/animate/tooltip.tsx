'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

export const TooltipProvider = ({
  children,
  delayDuration = 0,
}: {
  children: React.ReactNode;
  delayDuration?: number;
}) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration}>
    {children}
  </TooltipPrimitive.Provider>
);

export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className = '', sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={`z-50 rounded-md bg-black px-2 py-1 text-xs text-white ${className}`}
    {...props}
  />
));
TooltipContent.displayName = 'TooltipContent';
