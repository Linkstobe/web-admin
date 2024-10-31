"use client"; 
import { LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes, ReactElement } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";

interface TableBasicActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  tooltipText: string;
}

export default function TableBasicAction({
  icon: Icon,
  tooltipText,
  ...rest
}: TableBasicActionProps) {
  return (
    <div>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button 
              {...rest}
              className="flex items-center"
            >
              <Icon />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
