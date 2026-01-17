import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import router from './routes'
import { RouterProvider } from 'react-router/dom'
import './locale/i18n'
import { ThemeProvider } from './providers/theme-provider'
import { LanguageProvider } from './providers/language-provider'
import { AudienceProvider } from './providers/audience-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LanguageProvider>
        <AudienceProvider defaultAudience="math_engineering" storageKey="user-audience">
          <RouterProvider router={router} />
        </AudienceProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
