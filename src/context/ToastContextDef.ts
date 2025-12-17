import { createContext } from 'react'

export interface ToastItem {
  id: string
  title?: string
  description: string
  variant?: 'default' | 'success' | 'error'
}

export interface ToastContextType {
  toast: (options: Omit<ToastItem, 'id'>) => void
  success: (description: string, title?: string) => void
  error: (description: string, title?: string) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)
