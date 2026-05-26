import { BookOpen } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '@/hooks/useTheme'  // celui qui retourne { isDark, toggleTheme }

export default function Header() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
      <div className="text-center sm:text-left">
        <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-rdc bg-clip-text text-transparent">
          Elikya
        </h1>
        <p className="text-foreground/60 mt-2 flex items-center gap-2 justify-center sm:justify-start text-sm sm:text-base">
          <BookOpen className="h-4 w-4" />
          Préparation intelligente à l'Examen d'État
        </p>
      </div>
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
    </div>
  )
}