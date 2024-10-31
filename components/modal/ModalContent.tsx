import { ReactNode } from "react"

interface ModalContentProps {
  children: ReactNode
}

export default function ModalContent ({
  children
}: ModalContentProps) {
  return (
    <div>
      { children }
    </div>
  )
}