import { HTMLAttributes } from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationProps extends HTMLAttributes<HTMLDivElement> {
  type: 'success' | 'error' | 'info'
  message: string
  onClose?: () => void
}

const icons = {
  success: <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />,
  error: <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400 animate-shake" />,
  info: <Info className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />,
}

const styles = {
  success: 'bg-emerald-100/90 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200',
  error: 'bg-red-100/90 dark:bg-red-500/10 border-red-300 dark:border-red-500/30 text-red-900 dark:text-red-200',
  info: 'bg-blue-100/90 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30 text-blue-900 dark:text-blue-200',
}

export default function Notification({ 
  type, 
  message, 
  onClose,
  className,
  ...props 
}: NotificationProps) {
  return (
    <div
      role="alert"
      className={cn(
        "mb-4 p-4 rounded-xl border flex items-start gap-3 transition-all duration-300 w-full",
        "backdrop-blur-md shadow-sm",
        styles[type],
        className
      )}
      {...props}
    >
      <div className="mt-0.5 flex-shrink-0">
        {icons[type]}
      </div>
      <div className="flex-1 text-sm sm:text-base font-medium leading-relaxed break-words">
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="flex-shrink-0 p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/40"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}