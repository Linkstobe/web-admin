"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface TableTopSectionProps extends HTMLAttributes<HTMLDivElement> {}

export default function TableTopSection({
  children,
  className,
}: TableTopSectionProps) {
  return (
    <div className={cn("flex justify-between items-center p-4", className)}>
      {children}
    </div>
  );
}
