"use client"

import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Status = {
  value: string
  label: string
}

const statuses: Status[] = [
  {
    value: "active",
    label: "Активна",
  },
  {
    value: "completed",
    label: "Выполнена",
  },
  {
    value: "paused",
    label: "Приостановлена",
  },
]

interface StatusSelectorProps {
  selectedStatus: string
  onStatusChange: (status: string) => void
}

export function StatusSelector({ selectedStatus, onStatusChange }: StatusSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const currentStatus = statuses.find(status => status.value === selectedStatus)

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {currentStatus ? <>{currentStatus.label}</> : <>+ Выбрать статус</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList setOpen={setOpen} onStatusChange={onStatusChange} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {currentStatus ? <>{currentStatus.label}</> : <>+ Выбрать статус</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} onStatusChange={onStatusChange} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function StatusList({
  setOpen,
  onStatusChange,
}: {
  setOpen: (open: boolean) => void
  onStatusChange: (status: string) => void
}) {
  return (
    <Command>
      <CommandList>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                onStatusChange(value)
                setOpen(false)
              }}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
