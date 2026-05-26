import { useState, useRef, DragEvent, ChangeEvent, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import GradientButton from '../common/GradientButton'
import { FileUp, FileText, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PdfInstantUploadProps {
  onProcess: (file: File) => void
  loading: boolean
}

export default function PdfInstantUpload({ onProcess, loading }: PdfInstantUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true)
    else if (e.type === "dragleave") setIsDragActive(false)
  }

  const validateAndSetFile = (selectedFile: File | undefined) => {
    setError(null)
    if (!selectedFile) return
    if (selectedFile.type !== "application/pdf") {
      setError("Seuls les fichiers PDF sont acceptés.")
      setFile(null)
      return
    }
    setFile(selectedFile)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (loading) return
    const droppedFile = e.dataTransfer.files?.[0]
    validateAndSetFile(droppedFile)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    validateAndSetFile(selectedFile)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (file && !loading) onProcess(file)
  }

  const triggerFileInput = () => {
    if (!loading) fileInputRef.current?.click()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-8 pt-6 border-t border-border/40 w-full">
      <div className="space-y-2 w-full">
        <label className="text-sm font-bold tracking-wide uppercase opacity-80 text-foreground/80 block">
          Analyse de document PDF (instantané)
        </label>
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={cn(
            "relative group border-2 border-dashed rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer overflow-hidden",
            "bg-card/30 dark:bg-card/10 border-border/60 backdrop-blur-md",
            isDragActive 
              ? "border-primary bg-primary/10 scale-[1.01] shadow-[0_0_20px_rgba(var(--color-primary),0.15)]" 
              : "hover:border-primary/40 hover:bg-card/50 dark:hover:bg-card/20",
            loading && "opacity-50 pointer-events-none"
          )}
        >
          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />
          {file ? (
            <div className="flex flex-col items-center text-center gap-2 animate-fade-in w-full max-w-xs">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                <FileText className="h-8 w-8 animate-bounce" />
              </div>
              <div className="w-full">
                <p className="text-sm font-semibold truncate text-foreground pr-1">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {(file.size / (1024 * 1024)).toFixed(2)} Mo • PDF prêt
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Document validé
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-2 animate-fade-in">
              <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-semibold text-foreground/90">
                  Glisse ton PDF ici ou <span className="text-primary group-hover:underline">parcours tes fichiers</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Items, résumés de cours, fiches de révision
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-accent)] bg-[var(--color-accent)]/10 p-3 rounded-lg border border-[var(--color-accent)]/20 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <GradientButton 
        type="submit" 
        disabled={loading || !file} 
        isLoading={loading}
        className="w-full h-12 shadow-md"
      >
        {!loading && <FileUp className="h-4 w-4" />}
        Analyser le document instantanément
      </GradientButton>
    </form>
  )
}