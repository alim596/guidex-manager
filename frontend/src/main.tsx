import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from "./components/ThemeContext"
import './index.css'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
)
