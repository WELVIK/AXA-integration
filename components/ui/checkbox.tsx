"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from 'lucide-react'
import { cn } from "@/lib/utils"
import { COLORS } from "@/contexts/ThemeContext"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const colors = isDark ? COLORS.dark : COLORS.light

  const checkboxStyle = {
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: '0.25rem',
    border: `2px solid ${colors.border}`,
    backgroundColor: props.checked ? colors.primary : 'transparent',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer'
  }

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn("peer shrink-0 rounded-sm border-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
      style={checkboxStyle}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Check 
          size={16} 
          color={isDark ? colors.background : '#FFFFFF'} 
          strokeWidth={3}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
