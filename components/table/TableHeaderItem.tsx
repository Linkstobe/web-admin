"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TableHeaderItemProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

export default function TableHeaderItem({
  title,
  children,
  className,
}: TableHeaderItemProps) {
  return (
    <td
      className={cn(
        "bg-[#164F62] py-2 pl-4 last:pr-4 text-xs font-bold text-white",
        className
      )}
    >
      {children}
      {title}
    </td>
  );
}
