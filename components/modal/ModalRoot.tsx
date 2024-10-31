import { ReactNode } from "react"
import { Dialog } from "../ui/dialog"

interface ModalRootProps {
  children: ReactNode
}

export default function ModalRoot ({
  children
}: ModalRootProps) {
  return (
    <Dialog 
      modal
    >
      { children }
    </Dialog>
  )
}