import { ReactNode } from "react"
import { DialogFooter } from "../ui/dialog"

interface ModalFooterProps {
  children: ReactNode
}

export default function ModalFooter ({
  children
}: ModalFooterProps) {
  return (
    <DialogFooter
      className="border-t pt-6"
    >
      { children }
    </DialogFooter>
  )
}