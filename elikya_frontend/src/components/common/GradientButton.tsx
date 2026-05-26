import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface GradientButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  children: React.ReactNode
  variantType?: 'primary-blue' | 'rdc-full'
  isLoading?: boolean
}

export default function GradientButton({ 
  children, 
  onClick, 
  type = 'button', 
  disabled, 
  className,
  variantType = 'primary-blue',
  isLoading = false,
  ...props 
}: GradientButtonProps) {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled || isLoading} 
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        "btn-elite relative overflow-hidden text-sm sm:text-base tracking-wide font-bold h-10 px-4 py-2",
        variantType === 'rdc-full' && "bg-gradient-rdc hover:brightness-110",
        variantType === 'primary-blue' && "bg-gradient-blue",
        "focus-visible:outline-none",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      <span className="absolute inset-x-0 top-0 h-[1px] bg-white/20 pointer-events-none" />
      {isLoading ? (
        <div className="flex items-center gap-2 animate-fade-in">
          <Loader2 className="h-4 w-4 animate-spin text-white" />
          <span>Analyse en cours...</span>
        </div>
      ) : (
        <span className="flex items-center justify-center gap-2 w-full h-full">
          {children}
        </span>
      )}
    </button>
  )
}