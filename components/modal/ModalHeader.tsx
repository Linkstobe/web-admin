import { ReactNode } from "react"
import { DialogHeader } from "../ui/dialog"

interface ModalHeaderProps {
  children: ReactNode
}

export default function ModalHeader ({
  children
}: ModalHeaderProps) {
  return (
    <DialogHeader
      className="border-b pb-6 border-[#D9D9D9]"
    >
      { children }
    </DialogHeader>
  )
}