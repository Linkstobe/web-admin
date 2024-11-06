import { ReactNode } from "react";
import { DialogClose } from "../ui/dialog";
import { cn } from "@/lib/utils";

interface ModalCloseButtonProps {
  children: ReactNode
  className?: string
}

export default function ModalCloseButton ({
  children,
  className
}: ModalCloseButtonProps) {
  return (
    <DialogClose 
      className={cn(className)}
      asChild
    >
      { children }
    </DialogClose>
  )
}