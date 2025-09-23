import * as React from "react";

import { cn } from "@/lib/utils";

export const ContextMenu = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

export const ContextMenuTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
ContextMenuTrigger.displayName = "ContextMenuTrigger";

export const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("min-w-32 p-1", className)}
    {...props}
  >
    {children}
  </div>
));
ContextMenuContent.displayName = "ContextMenuContent";

export const ContextMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-2 py-1", className)} {...props} />
));
ContextMenuItem.displayName = "ContextMenuItem";

export const ContextMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-2 py-1", className)} {...props} />
));
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

export const ContextMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-2 py-1", className)} {...props} />
));
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

export const ContextMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("font-semibold", className)} {...props} />
));
ContextMenuLabel.displayName = "ContextMenuLabel";

export const ContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("h-px bg-border", className)} {...props} />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

export const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto text-xs", className)} {...props} />
);
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export const ContextMenuGroup = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

export const ContextMenuPortal = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

export const ContextMenuSub = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

export const ContextMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("min-w-32 p-1", className)}
    {...props}
  >
    {children}
  </div>
));
ContextMenuSubContent.displayName = "ContextMenuSubContent";

export const ContextMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-2 py-1", className)} {...props} />
));
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

export const ContextMenuRadioGroup = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

export const ContextMenuItemIndicator = ({ children }: { children: React.ReactNode }) => (
  <span>{children}</span>
);