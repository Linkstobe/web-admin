"use client"; 
import { LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface TableBasicActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  tooltipText: string;
}

export default function TableBasicAction({
  icon: Icon,
  tooltipText,
  className,
  ...rest
}: TableBasicActionProps) {
  return (
    <div>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button 
              {...rest}
              className={cn(
                "flex items-center",
                className
              )}
            >
              <Icon />
            </button>
          </TooltipTrigger>
          <TooltipContent
            className=""
          >
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
