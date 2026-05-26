import { Question } from '../../lib/api'
import { Sparkles, BookOpen, Calendar, HelpCircle, ArrowRight } from 'lucide-react'
import GlassCard from '../common/GlassCard'
import { cn } from '@/lib/utils'

interface RecommendationResultsProps {
  questions: Question[]
}

export default function RecommendationResults({ questions }: RecommendationResultsProps) {
  if (!questions || questions.length === 0) return null

  return (
    <GlassCard glow hoverable={false} className="mt-8 p-0 overflow-hidden border-primary/20">
      <div className="p-5 sm:p-6 border-b border-border/40 bg-primary/5 dark:bg-primary/10 flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-bold tracking-tight flex items-center gap-2.5 text-base sm:text-lg text-foreground">
          <Sparkles className="h-5 w-5 text-[var(--color-secondary)] animate-pulse shrink-0" />
          <span>Questions Exetat recommandées</span>
        </h3>
        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-background/80 border border-border/60 backdrop-blur-md text-primary">
          {questions.length} {questions.length > 1 ? 'items trouvés' : 'item trouvé'}
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {questions.map((q, idx) => (
          <div 
            key={idx} 
            className={cn(
              "group relative p-4 sm:p-5 rounded-xl transition-all duration-300 flex flex-col sm:flex-row items-start gap-4 break-words w-full",
              "bg-background/40 border border-border/60",
              "hover:border-primary/30 hover:bg-card hover:shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]",
              "dark:hover:shadow-[0_4px_30px_-10px_rgba(0,0,0,0.3)]"
            )}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary border border-primary/20 dark:bg-primary/20 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              {idx + 1}
            </div>
            <div className="space-y-3 flex-1 w-full">
              <p className="font-semibold leading-relaxed text-sm sm:text-base text-foreground/90 group-hover:text-foreground transition-colors pr-2">
                {q.question}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-card border border-border/60 text-muted-foreground shadow-sm">
                  <BookOpen className="h-3.5 w-3.5 text-primary" /> 
                  <span>{q.matiere}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-card border border-border/60 text-muted-foreground shadow-sm">
                  <Calendar className="h-3.5 w-3.5 text-[var(--color-accent)]" /> 
                  <span>Année {q.annee}</span>
                </span>
                <span className="ml-auto opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden sm:inline-flex items-center gap-1 text-xs font-bold text-primary">
                  S'entraîner <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 bg-card/50 border-t border-border/30 flex items-center gap-2 text-xs text-muted-foreground font-medium">
        <HelpCircle className="h-3.5 w-3.5 text-primary shrink-0" />
        <span>Ces questions proviennent directement des archives officielles de l'Exetat en RDC.</span>
      </div>
    </GlassCard>
  )
}