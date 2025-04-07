'use client';
import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
  loading?: boolean
}

export function SearchInput({
  className,
  onSearch,
  loading = false,
  ...props
}: SearchInputProps) {
  const [value, setValue] = React.useState("")
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)
      onSearch?.(newValue)
    },
    [onSearch]
  )

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-8 pr-4"
        value={value}
        onChange={handleChange}
        aria-label="Search"
        disabled={loading}
        {...props}
      />
      {loading && (
        <div className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      )}
    </div>
  )
}
