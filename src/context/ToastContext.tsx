import { useState, useCallback, type ReactNode } from 'react'
import { Toast, ToastContainer } from '@/components/ui/toast'
import { ToastContext, type ToastItem } from './ToastContextDef'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((options: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...options, id }])
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }, [removeToast])

  const toast = useCallback((options: Omit<ToastItem, 'id'>) => {
    addToast(options)
  }, [addToast])

  const success = useCallback((description: string, title?: string) => {
    addToast({ description, title, variant: 'success' })
  }, [addToast])

  const error = useCallback((description: string, title?: string) => {
    addToast({ description, title, variant: 'error' })
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toast, success, error }}>
      {children}
      <ToastContainer>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            title={t.title}
            description={t.description}
            variant={t.variant}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}

