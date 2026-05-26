import { useState, FormEvent, ChangeEvent } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import GradientButton from '../common/GradientButton'
import { Lightbulb, Sparkles, BookMarked, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecommendationFormProps {
  onRecommend: (texte: string, matiere: string) => void
  loading: boolean
}

const suggestions = [
  { text: "Résoudre une équation du second degré", subject: "Mathématiques" },
  { text: "Expliquer le rôle des globules rouges", subject: "Biologie" },
  { text: "Citer les ressources minières de la RDC", subject: "Histoire-Géographie" },
  { text: "Définir un tissu biologique", subject: "Biologie" },
  { text: "Conjuguer un verbe au subjonctif présent", subject: "Français" }
]

export default function RecommendationForm({ onRecommend, loading }: RecommendationFormProps) {
  const [texte, setTexte] = useState('')
  const [matiere, setMatiere] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (texte.trim() && !loading) onRecommend(texte.trim(), matiere.trim())
  }

  const handleSuggestion = (text: string, subject: string) => {
    if (loading) return
    setTexte(text)
    setMatiere(subject)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full animate-fade-in">
      <div className="space-y-2">
        <label className="text-sm font-bold tracking-wide uppercase opacity-80 text-foreground/80 flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-primary" />
          <span>Ton énoncé (cours, notes ou exercice)</span>
        </label>
        <div className="relative group">
          <Textarea
            placeholder="Exemple : Écris ici ce que tu veux réviser ou copie un exercice d'Exetat..."
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            rows={5}
            disabled={loading}
            className={cn(
              "w-full bg-input/40 border-border/60 backdrop-blur-md resize-none p-4 rounded-xl text-sm sm:text-base leading-relaxed transition-all duration-300",
              "focus:bg-card focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none",
              "disabled:opacity-50"
            )}
          />
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-blue scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-b-xl" />
        </div>
        <p className="text-xs text-muted-foreground flex items-start gap-1.5 px-1 mt-1">
          <Sparkles className="h-3.5 w-3.5 mt-0.5 text-secondary shrink-0" />
          <span>Utilise des verbes clairs : <strong>calculer, expliquer, définir, citer</strong>. L'IA sera plus précise.</span>
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold tracking-wide uppercase opacity-80 text-foreground/80 flex items-center gap-1.5">
          <BookMarked className="h-4 w-4 text-primary" />
          <span>Matière (optionnelle mais recommandée)</span>
        </label>
        <Input
          placeholder="Ex: mathématiques, français, biologie, physique-chimie, histoire-géo"
          value={matiere}
          onChange={(e) => setMatiere(e.target.value)}
          disabled={loading}
          className="bg-input/40 border-border/60 backdrop-blur-md"
        />
      </div>

      <GradientButton type="submit" disabled={loading || !texte.trim()} isLoading={loading} className="w-full h-12 shadow-md">
        Obtenir des questions similaires
      </GradientButton>

      <div className="mt-6 p-4 rounded-xl border border-border/50 bg-card/30 dark:bg-card/10 backdrop-blur-md shadow-sm">
        <p className="text-xs sm:text-sm font-bold tracking-wide text-foreground/90 flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-secondary animate-pulse" /> 
          <span>EXEMPLES QUI MARCHENT BIEN :</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              disabled={loading}
              onClick={() => handleSuggestion(s.text, s.subject)}
              className={cn(
                "text-xs text-left px-3 py-2 rounded-xl transition-all duration-300 border border-border/60 bg-background/50 text-foreground/80",
                "hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:-translate-y-[1px]",
                "active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              )}
            >
              <span className="font-semibold text-[10px] uppercase tracking-wider text-primary mr-1 bg-primary/10 px-1.5 py-0.5 rounded-md dark:bg-primary/20">
                {s.subject}
              </span>
              <span>{s.text}</span>
            </button>
          ))}
        </div>
      </div>
    </form>
  )
}