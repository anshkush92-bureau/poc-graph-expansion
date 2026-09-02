import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles.css'

const host = document.getElementById('root')
if (!host) throw new Error('index.html is missing #root')
createRoot(host).render(<App />)
