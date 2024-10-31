"use client"

interface TableHeaderItemProps {
  title: string
}

export default function TableHeaderItem ({
  title
}: TableHeaderItemProps) {
  return (
    <td
      className="bg-[#164F62] py-2 pl-4 last:pr-4 text-xs font-bold text-white"
    >
      { title }
    </td>
  )
}