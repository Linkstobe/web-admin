'use client'

import { Check } from "lucide-react"
import { Button } from "../ui/button"

interface TableTopButtonConfirmProps {
  onConfirm?: () => void
}

export default function TableTopButtonConfirm ({
  onConfirm
}: TableTopButtonConfirmProps) {
  return (
    <Button
      variant="success"
      onClick={onConfirm}
    >
      <Check />
    </Button>
  )
}