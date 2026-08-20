import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary/15 text-primary border border-primary/30",
        secondary:
          "bg-secondary text-secondary-foreground border border-border",
        destructive:
          "bg-destructive/15 text-destructive border border-destructive/30",
        warning:
          "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
        info:
          "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30",
        outline: "text-foreground border border-border",
        gold: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
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
