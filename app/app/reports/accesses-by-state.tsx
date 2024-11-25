'use client'
import AnalyticsPieChart from "@/components/analytics-pie-chart"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IMetric } from "@/interfaces/IMetrics"
import { cn } from "@/lib/utils"
import { MetricsServices } from "@/services/metrics.service"
import { Check, ChevronsUpDown } from "lucide-react"
import { useEffect, useState } from "react"


export default function AccessesByState () {
  const [stateAccessMetrics, setStateAccessMetrics] = useState([])
  const [countryAccessMetrics, setCountryAccessMetrics] = useState([])

  const [selectedCountry, setSelectedCountry] = useState("Brazil")
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("Brazil")

  useEffect(() => {
    const getMetrics = async () => {
      const allMetrics = await MetricsServices.onGetAllMetrics()
      const locationMetrics = allMetrics.filter(({ link_type }) => link_type.startsWith("location:"))
      const locationCountByState = {}
      const locationCountByCountry = {}

      locationMetrics.forEach(({ link_type }) => {
        const locationName = link_type.replace("location:", "")
        let [country, state] = locationName.split("-")
        
        country = country === "unknown" ? "Not found" : country
        state = state === "unknown" ? "Not found" : state

        if (state) {
          locationCountByState[country] = locationCountByState[country] || {}
          locationCountByState[country][state] = (locationCountByState[country][state] || 0) + 1

          locationCountByCountry[country] = (locationCountByCountry[country] || new Set()).add(state)
        }
      })

      const formattedCountryMetrics = Object.entries(locationCountByCountry).map(([name, statesSet]) => ({
        name,
        // @ts-ignore
        value: statesSet.size
      }))
      setCountryAccessMetrics(formattedCountryMetrics)

      filterMetricsForCountry(locationCountByState)
    }

    const filterMetricsForCountry = (data: any) => {
      const filteredStates = data[selectedCountry] || {}
      const formattedStateMetrics = Object.entries(filteredStates).map(([name, value]) => ({ name, value }))
      setStateAccessMetrics(formattedStateMetrics)
    }

    getMetrics()
  }, [selectedCountry])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold tracking-tight text-[#164F62]">
          Acessos por estados
        </h3>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value || "Select country..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {countryAccessMetrics.map((country) => (
                    <CommandItem
                      key={country.name}
                      value={country.name}
                      onSelect={(currentValue) => {
                        setValue(currentValue)
                        setSelectedCountry(currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === country.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {country.name} - {country.value} {country.value > 1 ? "states" : "state"}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <AnalyticsPieChart
        label={`Acessos (${selectedCountry})`}
        backgroundColor={["#FF6347", "#4682B4", "#1E90FF", "#A9A9A9", "#87CEFA", "#32CD32"]}
        hoverBackgroundColor={["#E5533B", "#357AB9", "#1C7AC0", "#8C8C8C", "#6BAED7", "#28A428"]}
        metrics={stateAccessMetrics}
      />
    </div>
  )
}
