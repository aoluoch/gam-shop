import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastProps {
  id: string
  title?: string
  description: string
  variant?: 'default' | 'success' | 'error'
  onClose: (id: string) => void
}

export function Toast({ id, title, description, variant = 'default', onClose }: ToastProps) {
  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5',
        'animate-in slide-in-from-top-full fade-in duration-300',
        variant === 'default' && 'bg-background border',
        variant === 'success' && 'bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800',
        variant === 'error' && 'bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1">
            {title && (
              <p
                className={cn(
                  'text-sm font-medium',
                  variant === 'default' && 'text-foreground',
                  variant === 'success' && 'text-green-800 dark:text-green-200',
                  variant === 'error' && 'text-red-800 dark:text-red-200'
                )}
              >
                {title}
              </p>
            )}
            <p
              className={cn(
                'text-sm',
                title && 'mt-1',
                variant === 'default' && 'text-muted-foreground',
                variant === 'success' && 'text-green-700 dark:text-green-300',
                variant === 'error' && 'text-red-700 dark:text-red-300'
              )}
            >
              {description}
            </p>
          </div>
          <button
            onClick={() => onClose(id)}
            className={cn(
              'ml-4 inline-flex shrink-0 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
              variant === 'default' && 'text-muted-foreground hover:text-foreground',
              variant === 'success' && 'text-green-500 hover:text-green-600 focus:ring-green-500',
              variant === 'error' && 'text-red-500 hover:text-red-600 focus:ring-red-500'
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end gap-2 p-4 sm:p-6">
      {children}
    </div>
  )
}
