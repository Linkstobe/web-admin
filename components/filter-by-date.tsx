"use client"

import * as React from "react"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ptBR } from "date-fns/locale"

interface Item {
  createdAt: Date
}

interface FilterByDateProps {
  className?: string
  items: Item[]
  children: React.ReactNode
  setFilteredItems: (filteredItems: Item[]) => void
}

export default function FilterByDate({
  className,
  children,
  items,
  setFilteredItems,
}: FilterByDateProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: addDays(new Date(2023, 0, 20), 20),
  })

  const handleFilter = () => {
    if (date?.from && date?.to) {
      const filteredItems = items.filter(item => {
        const createdAt = item.createdAt;
        return createdAt >= date.from && createdAt <= date.to;
      });
      setFilteredItems(filteredItems);
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          { children }
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={ptBR}
          />
          <div className="mt-2">
            <Button onClick={handleFilter} variant="default">
              Filtrar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
