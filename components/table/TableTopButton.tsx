import { LucideIcon } from "lucide-react"
import { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface TableTopButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
}

export default function TableTopButton ({
  icon: Icon,
  className,
  ...rest
}: TableTopButtonProps) {
  return (
    <button
      {...rest}
      className={cn("bg-[#164F62] p-2 rounded-lg", className)}
    >
      { <Icon /> }
    </button>
  )
}