import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  // Base styles with improved padding and typography for Japanese + emoji content
  [
    'inline-flex items-center justify-center gap-1',
    'rounded-md border',
    'px-2 py-1 sm:px-2.5 sm:py-1',
    'text-2xs sm:text-xs',
    'font-medium leading-none tracking-wide',
    'whitespace-nowrap',
    'transition-all duration-fast',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        default:
          'border-primary/15 bg-primary/8 hover:bg-primary/12 text-primary',
        secondary:
          'border-border bg-secondary text-secondary-foreground hover:bg-accent',

        outline:
          'border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        // Tech tags - subtle primary tones matching the design system
        tech: 'border-primary/10 bg-primary/5 text-primary/80 hover:bg-primary/10 dark:border-primary/20 dark:bg-primary/10 dark:text-primary/90',
        // Project tags - slightly different tone
        project:
          'border-muted-foreground/20 dark:border-muted-foreground/25 bg-muted text-muted-foreground hover:bg-accent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
