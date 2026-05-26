import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GlassCard from './components/common/GlassCard'
import NotificationComponent from './components/common/Notification'
import Header from './components/Layout/Header'
import RecommendationForm from './components/Recommendation/RecommendationForm'
import RecommendationResults from './components/Recommendation/RecommendationResults'
import PdfInstantUpload from './components/Recommendation/PdfInstantUpload'
import UploadForm from './components/Upload/UploadForm'
import StatsDisplay from './components/Stats/StatsDisplay'
import { Sparkles, CloudUpload, BarChart3, AlertTriangle, Lightbulb, Target, TrendingUp, Code, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadFile, processPdf, recommendQuestions, fetchStats, Question, StatsResponse } from './lib/api'

interface AppNotification {
  type: 'success' | 'error' | 'info'
  text: string
}

function App() {
  const [activeTab, setActiveTab] = useState<string>('recommend')
  const [loading, setLoading] = useState<boolean>(false)
  const [notification, setNotification] = useState<AppNotification | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [stats, setStats] = useState<StatsResponse | null>(null)

  const showMessage = (type: AppNotification['type'], text: string) => {
    setNotification({ type, text })
    setTimeout(() => setNotification(null), 5000)
  }

  useEffect(() => {
    if (activeTab === 'stats' && !stats) {
      handleRefreshStats()
    }
  }, [activeTab, stats])

  const handleRecommend = async (texte: string, matiere: string) => {
    setLoading(true)
    try {
      const data = await recommendQuestions(texte, matiere || undefined)
      const extracted = data.themes_recommandes || []
      setQuestions(extracted)
      if (extracted.length === 0) {
        showMessage('info', 'Aucune question similaire trouvée. Essayez d’autres mots-clés.')
      } else {
        showMessage('success', `${extracted.length} questions recommandées.`)
      }
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (file: File) => {
    setLoading(true)
    try {
      const res = await uploadFile(file)
      showMessage('success', res.message || 'Fichier envoyé. Traitement IA en cours...')
      setStats(null)
      setActiveTab('stats')
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  const handleInstantPdf = async (file: File) => {
    setLoading(true)
    try {
      const data = await processPdf(file)
      const extracted = data.questions_similaires || []
      setQuestions(extracted)
      if (extracted.length === 0) {
        showMessage('info', 'Aucune question similaire trouvée dans ce PDF.')
      } else {
        showMessage('success', 'PDF analysé avec succès !')
        setActiveTab('recommend')
      }
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshStats = async () => {
    setLoading(true)
    try {
      const data = await fetchStats()
      setStats(data)
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden transition-colors duration-300 flex flex-col">
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-primary/5 via-transparent to-transparent blur-3xl pointer-events-none" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1">
        
        {/* Barre de navigation supérieure */}
        <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 px-4 py-3 shadow-sm transition-all">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Header />
            <TabsList className="grid grid-cols-3 h-11 w-full md:w-[450px] bg-card/60 border border-border/40 p-1 rounded-xl shadow-inner">
              <TabsTrigger value="recommend" className="rounded-lg font-bold text-xs sm:text-sm gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                <Sparkles className={cn("h-4 w-4", activeTab === 'recommend' && "text-amber-500")} />
                <span>IA</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="rounded-lg font-bold text-xs sm:text-sm gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                <CloudUpload className="h-4 w-4" />
                <span>Ajouter</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="rounded-lg font-bold text-xs sm:text-sm gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                <BarChart3 className="h-4 w-4" />
                <span>Stats</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-6xl w-full mx-auto px-4 py-6 relative z-10 flex-1 space-y-6">
          
          {/* Carte de présentation : objectif d'Elikya */}
          <GlassCard className="p-5 border-primary/20 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-xl shrink-0">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  Pourquoi Elikya ?
                </h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Elikya est conçu pour aider les finalistes à préparer efficacement l’Examen d’État en RDC.
                  Notre IA analyse des milliers de questions des années passées pour identifier 
                  <strong className="text-foreground"> les thèmes et formulations qui reviennent le plus souvent</strong>.
                  L’élève peut déposer son cours, un exercice ou un PDF, et le système lui recommande 
                  <strong> les questions types les plus fréquentes</strong> avec les années de sortie.
                  <br /><br />
                  <span className="text-xs italic">
                    ⚠️ L’outil ne garantit pas l’apparition de ces questions à l’examen, mais il maximise vos chances 
                    en ciblant les révisions sur ce qui a vraiment été demandé.
                  </span>
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Bandeau d'information IA (Alpha) */}
          <div className="w-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400 tracking-wide uppercase">
                Version Alpha — Laboratoire IA
              </h4>
              <p className="text-xs sm:text-sm text-amber-600/70 dark:text-amber-500/80 leading-relaxed">
                Le modèle est en amélioration continue. Quelques fautes d’orthographe peuvent subsister, mais l’essence des questions reste claire et exploitable.
              </p>
            </div>
          </div>

          {/* Guide utilisateur enrichi avec exemples d'abréviations et astuces verbales */}
          <GlassCard className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide">🎓 Conseils pour une recherche efficace</h3>
                <ul className="text-xs sm:text-sm text-muted-foreground mt-2 space-y-2 list-disc list-inside">
                  <li>
                    <strong>Joue avec les verbes d’action</strong> : l’IA reconnaît plusieurs formes. 
                    Essaie <kbd className="bg-background px-1.5 py-0.5 rounded mx-0.5">définir</kbd>, 
                    <kbd className="bg-background px-1.5 py-0.5 rounded mx-0.5">def</kbd>, 
                    <kbd className="bg-background px-1.5 py-0.5 rounded mx-0.5">définissez</kbd> – ou bien 
                    <kbd className="bg-background px-1.5 py-0.5 rounded mx-0.5">expliquer</kbd>, 
                    <kbd className="bg-background px-1.5 py-0.5 rounded mx-0.5">expliquez</kbd>, 
                    <kbd className="bg-background px-1.5 py-0.5 rounded mx-0.5">expl</kbd>.
                    Pour la conjugaison : <kbd className="bg-background px-1.5 py-0.5 rounded mx-0.5">conjuguer</kbd>, 
                    <kbd className="bg-background px-1.5 py-0.5 rounded mx-0.5">conj</kbd>, 
                    <kbd className="bg-background px-1.5 py-0.5 rounded mx-0.5">conjuguez etc...</kbd>.
                  </li>
                  <li>
                    <strong>Ajoute la matière</strong> (optionnelle) pour affiner : mathématiques, français, biologie, physique-chimie, histoire-géo.
                  </li>
                  <li>
                    <strong>Exemples qui fonctionnent</strong> (à copier/coller) :
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <kbd className="bg-background px-2 py-1 rounded text-xs">def suite arithmétique</kbd>
                      <kbd className="bg-background px-2 py-1 rounded text-xs">expliquer rôle globules rouges</kbd>
                      <kbd className="bg-background px-2 py-1 rounded text-xs">citer ressources minières RDC</kbd>
                      <kbd className="bg-background px-2 py-1 rounded text-xs">calc discriminant</kbd>
                      <kbd className="bg-background px-2 py-1 rounded text-xs">conj subjonctif présent</kbd>
                      <kbd className="bg-background px-2 py-1 rounded text-xs">définissez tissu biologique</kbd>
                    </div>
                  </li>
                  <li>
                    <strong>Astuce</strong> : Si une recherche échoue, reformule le verbe (ajoute "ez", "er", ou utilise l'abréviation). L'IA apprend en continu.
                  </li>
                </ul>
                <p className="text-xs mt-3 text-primary/80 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Plus ta saisie est précise, meilleurs sont les résultats. N’hésite pas à tester différentes formes.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Notification */}
          {notification && (
            <div className="animate-fade-in w-full">
              <NotificationComponent type={notification.type} message={notification.text} />
            </div>
          )}

          {/* Contenu des onglets */}
          <div className="w-full">
            <TabsContent value="recommend" className="outline-none m-0 animate-fade-in space-y-6">
              <GlassCard className="p-5 sm:p-6 border-border/40 shadow-md space-y-6">
                <RecommendationForm onRecommend={handleRecommend} loading={loading} />
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-border/40"></div>
                  <span className="flex-shrink mx-4 text-muted-foreground/30 text-xs tracking-widest uppercase font-black">OU</span>
                  <div className="flex-grow border-t border-border/40"></div>
                </div>
                <PdfInstantUpload onProcess={handleInstantPdf} loading={loading} />
              </GlassCard>
              {questions.length > 0 && <RecommendationResults questions={questions} />}
            </TabsContent>

            <TabsContent value="upload" className="outline-none m-0 animate-fade-in">
              <GlassCard className="p-5 sm:p-6 border-border/40 shadow-md">
                <div className="mb-5 space-y-1">
                  <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                    <CloudUpload className="h-5 w-5 text-primary" /> Envoi d'archives d'examens
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Ajoutez de nouvelles épreuves ou fiches (PDF ou image). L'IA les analysera et enrichira la base.
                  </p>
                </div>
                <UploadForm onUpload={handleUpload} loading={loading} />
              </GlassCard>
            </TabsContent>

            <TabsContent value="stats" className="outline-none m-0 animate-fade-in">
              <div className="w-full overflow-hidden">
                <GlassCard className="p-4 sm:p-6 border-border/40 shadow-md w-full">
                  <StatsDisplay stats={stats} onRefresh={handleRefreshStats} loading={loading} />
                </GlassCard>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>

      {/* Footer avec signature développeur */}
      <footer className="mt-8 py-4 text-center text-xs text-muted-foreground border-t border-border/30">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-1">
            <Code className="h-3 w-3" />
            <span>Développé par <strong className="text-foreground/80">Erick Nzambi</strong></span>
          </div>
          <div className="text-[10px]">
            © {new Date().getFullYear()} Elikya – Préparation intelligente à l'Examen d'État
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App