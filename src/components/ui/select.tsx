import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm",
            error && "border-destructive focus:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-xs text-destructive font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";


export { Select };
