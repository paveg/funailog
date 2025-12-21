import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-primary/20 bg-primary/10 hover:border-primary/30 hover:bg-primary/15 text-primary',
        secondary:
          'bg-secondary/60 text-secondary-foreground/90 hover:bg-secondary/80 border-border shadow-sm hover:border-border hover:text-secondary-foreground',
        destructive:
          'border-destructive/20 bg-destructive/10 hover:border-destructive/30 hover:bg-destructive/15 text-destructive',
        outline:
          'hover:border-foreground/30 border-border bg-transparent text-muted-foreground hover:text-foreground',
        // Green tech tags for technologies
        tech: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-900',
        // Blue project tags for project names
        project:
          'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:hover:border-blue-700 dark:hover:bg-blue-900',
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
