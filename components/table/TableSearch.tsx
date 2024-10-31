import { Search } from "lucide-react"

interface TableSearchProps {
  placeholder: string
  onChange: (value: string) => void
}

export default function TableSearch ({
  placeholder,
  onChange
}: TableSearchProps) {
  return (
    <div
      className="flex gap-2 px-4 border border-[#DAE0E7] rounded-3xl"
    >
      <label 
        htmlFor="table-search"
        className="py-2"
      >
        <Search 
          color="#164F62"
        />
      </label>

      <input
        id="table-search"
        onChange={(e) => onChange(e.target.value)}
        className="py-2 outline-none"
        type="text"
        placeholder={placeholder}
      />
    </div>
  )
}