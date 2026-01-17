import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import router from './routes'
import { RouterProvider } from 'react-router/dom'
import './locale/i18n'
import { ThemeProvider } from './providers/theme-provider'
import { LanguageProvider } from './providers/language-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
