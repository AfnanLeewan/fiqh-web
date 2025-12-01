import * as React from "react";

import { cn } from "@/lib/utils";

// Chart container stub
export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("h-64 w-full", className)} {...props}>
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Chart component stub - recharts not installed
    </div>
  </div>
));
ChartContainer.displayName = "ChartContainer";

// Chart tooltip stub
export const ChartTooltip = ({ children }: { children?: React.ReactNode }) => (
  <div>{children}</div>
);

// Chart tooltip content stub
export const ChartTooltipContent = ({
  children,
}: {
  children?: React.ReactNode;
}) => <div>{children}</div>;

// Chart legend stub
export const ChartLegend = ({ children }: { children?: React.ReactNode }) => (
  <div>{children}</div>
);

// Chart legend content stub
export const ChartLegendContent = ({
  children,
}: {
  children?: React.ReactNode;
}) => <div>{children}</div>;
