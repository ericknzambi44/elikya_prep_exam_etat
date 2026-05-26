import { useState } from 'react'
import { Input } from '@/components/ui/input'
import GradientButton from '../common/GradientButton'
import { Upload } from 'lucide-react'

interface UploadFormProps {
  onUpload: (file: File) => void
  loading: boolean
}

export default function UploadForm({ onUpload, loading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file) onUpload(file)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="file"
        accept=".pdf,.png,.jpg"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="bg-input/50 border-border/60"
        disabled={loading}
      />
      <GradientButton type="submit" disabled={loading || !file} className="w-full">
        <Upload className="h-4 w-4 mr-2" />
        {loading ? 'Envoi en cours...' : 'Envoyer pour ingestion automatique'}
      </GradientButton>
      {file && <p className="text-sm text-muted-foreground break-words">Fichier : {file.name}</p>}
      <p className="text-xs text-muted-foreground">
        Ce fichier sera ajouté à la base et traité automatiquement.
      </p>
    </form>
  )
}