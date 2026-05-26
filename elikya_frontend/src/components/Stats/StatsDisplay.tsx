import { StatsResponse } from '../../lib/api'
import GlassCard from '../common/GlassCard'
import { BarChart3, TrendingUp, BookOpen, Calendar, PieChart } from 'lucide-react'
import { StatCard } from '../StatCard'


interface StatsDisplayProps {
  stats: StatsResponse | null
  onRefresh: () => void
  loading: boolean
}

export default function StatsDisplay({ stats, onRefresh, loading }: StatsDisplayProps) {
  // Calcul du total des questions pour les pourcentages
  const totalQuestions = stats?.total_questions || 0

  return (
    <div className="space-y-6">
      <button
        onClick={onRefresh}
        disabled={loading}
        className="btn-elite px-5 py-2.5 text-sm rounded-xl inline-flex items-center gap-2 shadow-md"
      >
        <BarChart3 className="h-4 w-4" />
        {loading ? 'Chargement...' : 'Rafraîchir les données'}
      </button>

      {stats ? (
        <div className="space-y-8">
          {/* Cartes KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
              title="Base de connaissances"
              value={stats.total_questions}
              label="Questions analysées"
              icon={BookOpen}
            />
            <StatCard
              title="Matières couvertes"
              value={Object.keys(stats.matieres).length}
              label="Disciplines disponibles"
              icon={TrendingUp}
            />
            <StatCard
              title="Période couverte"
              value={`${Math.min(...stats.annees_disponibles)} - ${Math.max(...stats.annees_disponibles)}`}
              label="Années d'examens"
              icon={Calendar}
            />
          </div>

          {/* Répartition par matière avec barres de progression */}
          <GlassCard className="p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Répartition par matière
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.matieres).map(([matiere, count]) => {
                const percentage = (count / totalQuestions) * 100
                return (
                  <div key={matiere} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium capitalize">{matiere}</span>
                      <span className="text-muted-foreground">{count} questions ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-secondary/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>

          {/* Années disponibles */}
          <GlassCard className="p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              Années couvertes
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.annees_disponibles.map((year) => (
                <span key={year} className="px-3 py-1 bg-primary/20 rounded-full text-xs sm:text-sm font-medium">
                  {year}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          Cliquez sur "Rafraîchir" pour charger les statistiques.
        </p>
      )}
    </div>
  )
}