import * as React from "react";

import { cn } from "@/lib/utils";

export type CalendarProps = React.HTMLAttributes<HTMLDivElement> & {
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[] | { from: Date; to?: Date };
  onSelect?: (date: Date | Date[] | { from: Date; to?: Date } | undefined) => void;
  disabled?: boolean | ((date: Date) => boolean);
  showOutsideDays?: boolean;
};

function Calendar({
  className,
  ...props
}: CalendarProps) {
  return (
    <div
      className={cn("p-3", className)}
      {...props}
    >
      <div className="text-center text-sm text-muted-foreground">
        Calendar component stub - react-day-picker not installed
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
