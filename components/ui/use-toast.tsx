"use client"

import { useTheme } from 'next-themes'
import { toast, Toaster } from 'sonner'

export const useToast = () => {
  return { toast }
}

export { Toaster }
