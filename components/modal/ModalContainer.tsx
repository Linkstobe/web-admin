import { ReactNode } from "react";
import { DialogContent } from "../ui/dialog";
import { cn } from "@/lib/utils";

interface ModalContentProps {
  children: ReactNode
  className?: string
}

export default function ModalContainer ({
  children,
  className
}: ModalContentProps) {
  return (
    <DialogContent
      className={cn(
        "sm:max-w-[668px]",
        className
      )}
    >
      { children }
    </DialogContent>
  )
}