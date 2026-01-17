import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import router from './routes'
import { RouterProvider } from 'react-router/dom'
import './locale/i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />,
  </StrictMode>,
)
