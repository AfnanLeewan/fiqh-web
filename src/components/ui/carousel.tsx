import * as React from "react";

import { cn } from "@/lib/utils";

export type CarouselProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

function Carousel({ className, children, ...props }: CarouselProps) {
  return (
    <div className={cn("relative w-full", className)} {...props}>
      {children}
    </div>
  );
}

function CarouselContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
}

function CarouselItem({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function CarouselPrevious({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("absolute left-2 top-1/2 -translate-y-1/2", className)}
      {...props}
    >
      Prev
    </button>
  );
}

function CarouselNext({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("absolute right-2 top-1/2 -translate-y-1/2", className)}
      {...props}
    >
      Next
    </button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
