"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const PaginationContext = React.createContext<{
  siblingsCount: number;
} | null>(null);


const Pagination = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"nav"> & {
    items?: number;
  }
>(({ className, ...props }, ref) => {
  // const [page, setPage] = React.useState(1);

  return (
    <PaginationContext.Provider value={{ siblingsCount: 1 }}>
      <nav
        ref={ref}
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
      />
    </PaginationContext.Provider>
  );
});
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
      />
    );
  }
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => {
    return <li ref={ref} className={cn("", className)} {...props} />;
  }
);
PaginationItem.displayName = "PaginationItem";

const PaginationLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    isActive?: boolean;
  }
>(({ className, isActive, ...props }, ref) => {
  return (
    <a
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background p-0 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        className
      )}
      {...props}
    />
  );
});
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => {
  return (
    <a
      ref={ref}
      aria-label="Go to previous page"
      className={cn(
        "flex h-10 items-center gap-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span>Previous</span>
    </a>
  );
});
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => {
  return (
    <a
      ref={ref}
      aria-label="Go to next page"
      className={cn(
        "flex h-10 items-center gap-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span>Next</span>
      <ChevronRightIcon className="h-4 w-4" />
    </a>
  );
});
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      aria-hidden
      className={cn("flex h-10 w-10 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
});
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
};
