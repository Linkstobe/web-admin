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
      className={cn(className, "bg-[#164F62] p-2 rounded-lg")}
    >
      { <Icon /> }
    </button>
  )
}