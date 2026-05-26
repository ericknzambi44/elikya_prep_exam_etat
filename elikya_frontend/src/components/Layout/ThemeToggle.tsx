import React from 'react'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Remplacement de ButtonProps par le type de composant natif de React pour supprimer l'erreur ts(2305)
interface ThemeToggleProps extends Omit<React.ComponentPropsWithoutRef<typeof Button>, 'children'> {
  isDark: boolean
  onToggle: () => void
}

export default function ThemeToggle({ 
  isDark, 
  onToggle, 
  className, 
  ...props 
}: ThemeToggleProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onToggle}
      className={cn(
        // Base : alignement géométrique parfait et effet vitré subtil
        "relative h-10 w-10 rounded-xl border border-border/60 bg-background/40 backdrop-blur-md",
        "transition-all duration-300 active:scale-95 shadow-inner-sm",
        "hover:bg-primary/5 hover:border-primary/30",
        className
      )}
      aria-label="Changer de thème visuel"
      {...props}
    >
      {/* Icône Soleil (Mode Sombre activé -> Apparaît en Or doux) */}
      <Sun 
        className={cn(
          "h-5 w-5 text-[var(--color-secondary)] transition-all duration-500 ease-out",
          isDark 
            ? "rotate-0 scale-100 opacity-100" 
            : "-rotate-90 scale-0 opacity-0"
        )} 
      />
      
      {/* Icône Lune (Mode Clair activé -> Apparaît en Bleu IA) */}
      <Moon 
        className={cn(
          "absolute h-5 w-5 text-[var(--color-primary)] transition-all duration-500 ease-out",
          isDark 
            ? "rotate-90 scale-0 opacity-0" 
            : "rotate-0 scale-100 opacity-100"
        )} 
      />
    </Button>
  )
}