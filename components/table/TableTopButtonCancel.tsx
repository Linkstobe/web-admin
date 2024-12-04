'use client'

import { X } from "lucide-react";
import { Button } from "../ui/button";

interface TableTopButtonCancelProps {
  onCancel: () => void
}

export default function TableTopButtonCancel ({
  onCancel
}: TableTopButtonCancelProps) {
  return (
    <Button
      variant="destructive"
      onClick={onCancel}
    >
      <X />
    </Button>
  )
}