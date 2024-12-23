import { ReactNode } from "react"
import { DialogHeader } from "../ui/dialog"
import { cn } from "@/lib/utils"

interface ModalHeaderProps {
  children: ReactNode
  className?: string
}

export default function ModalHeader ({
  children,
  className
}: ModalHeaderProps) {
  return (
    <DialogHeader
      className={cn("border-b pb-6 border-[#D9D9D9]", className)}
    >
      { children }
    </DialogHeader>
  )
}