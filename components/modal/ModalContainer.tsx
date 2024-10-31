import { ReactNode } from "react";
import { DialogContent } from "../ui/dialog";

interface ModalContentProps {
  children: ReactNode
}

export default function ModalContainer ({
  children
}: ModalContentProps) {
  return (
    <DialogContent
      className="sm:max-w-[668px]"
    >
      { children }
    </DialogContent>
  )
}