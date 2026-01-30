'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;
export const SheetPortal = Dialog.Portal;

export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className = '', ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={`fixed inset-0 z-50 bg-black/50 ${className}`}
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ children, className = '', ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Dialog.Content
      ref={ref}
      className={`fixed z-50 bg-background p-6 outline-none ${className}`}
      {...props}
    >
      {children}
    </Dialog.Content>
  </SheetPortal>
));
SheetContent.displayName = 'SheetContent';

export const SheetHeader = ({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;
