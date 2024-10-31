import { ReactNode } from "react";
import { DialogTrigger } from "../ui/dialog";

interface ModalOpenButtonProps {
  children: ReactNode
  className?: string
}

export default function ModalOpenButton ({
  children,
  className
}: ModalOpenButtonProps) {
  return (
    <DialogTrigger
      className={className}
      asChild
    >
      { children }
    </DialogTrigger>
  )
} 