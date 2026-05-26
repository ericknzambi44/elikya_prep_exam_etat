import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  hoverable?: boolean
  glow?: boolean
}

export default function GlassCard({ 
  children, 
  className, 
  hoverable = false, 
  glow = false,
  ...props 
}: GlassCardProps) {
  return (
    <div 
      className={cn(
        "card-glass relative overflow-hidden transition-all duration-500",
        "p-5 sm:p-6 lg:p-8",
        "flex flex-col justify-between w-full h-full",
        hoverable && [
          "hover:-translate-y-1 hover:border-primary/40",
          "hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]",
          "dark:hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)]"
        ],
        className
      )}
      {...props}
    >
      {glow && (
        <div 
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full pointer-events-none blur-[60px] opacity-40 dark:opacity-20 animate-pulse"
          style={{
            background: 'radial-gradient(circle, var(--color-primary) 0%, var(--color-secondary) 100%)'
          }}
        />
      )}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
}