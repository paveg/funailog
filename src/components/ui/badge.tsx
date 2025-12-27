import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-primary/15 bg-primary/8 hover:bg-primary/12 text-primary',
        secondary:
          'border-border bg-secondary text-secondary-foreground hover:bg-accent',
        destructive:
          'border-destructive/20 bg-destructive/10 hover:bg-destructive/15 text-destructive',
        outline:
          'border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        // Tech tags - subtle warm tones matching the design system
        tech: 'border-primary/10 bg-primary/5 text-primary/80 hover:bg-primary/10 dark:border-primary/20 dark:bg-primary/10 dark:text-primary/90',
        // Project tags - slightly different tone
        project:
          'border-muted-foreground/20 dark:border-muted-foreground/25 bg-muted text-muted-foreground hover:bg-accent',
        // Category badge for blog posts
        category:
          'border-warm/20 hover:bg-warm/15 dark:border-warm/30 dark:bg-warm/10 bg-warm-light text-warm dark:text-warm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
