import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import router from './routes'
import { RouterProvider } from 'react-router/dom'
import './locale/i18n'
import { ThemeProvider } from './providers/theme-provider'
import { LanguageProvider } from './providers/language-provider'
import { AudienceProvider } from './providers/audience-provider'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <LanguageProvider>
          <AudienceProvider defaultAudience="department" storageKey="user-audience">
            <RouterProvider router={router} />
          </AudienceProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
