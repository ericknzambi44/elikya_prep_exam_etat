const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface Question {
  question: string
  matiere: string
  annee: number | string
}

export interface UploadResponse {
  message: string
}

export interface RecommendResponse {
  themes_recommandes: Question[]
}

export interface StatsResponse {
  total_questions: number
  matieres: Record<string, number>
  annees_disponibles: number[]
}

// Upload classique (ingestion automatique vers data/raw)
export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: formData })
  if (!res.ok) throw new Error((await res.json()).detail || 'Upload failed')
  return res.json()
}

// Traitement instantané d'un PDF (retourne directement les questions similaires)
export async function processPdf(file: File, matiere?: string): Promise<{ questions_similaires: Question[] }> {
  const formData = new FormData()
  formData.append('file', file)
  if (matiere) formData.append('matiere', matiere)
  const res = await fetch(`${API_BASE_URL}/process-pdf`, { method: 'POST', body: formData })
  if (!res.ok) throw new Error((await res.json()).detail || 'PDF processing failed')
  return res.json()
}

// Recommandation à partir d'un texte
export async function recommendQuestions(texte: string, matiere?: string): Promise<RecommendResponse> {
  const formData = new FormData()
  formData.append('texte', texte)
  if (matiere) formData.append('matiere', matiere)
  const res = await fetch(`${API_BASE_URL}/recommend`, { method: 'POST', body: formData })
  if (!res.ok) throw new Error((await res.json()).detail || 'Recommendation failed')
  return res.json()
}

// Statistiques
export async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_BASE_URL}/stats`)
  if (!res.ok) throw new Error((await res.json()).detail || 'Stats failed')
  return res.json()
}