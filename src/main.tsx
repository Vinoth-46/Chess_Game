import React from 'react'
import { createRoot } from 'react-dom/client'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import App from './App'
import './styles/index.css'

// Detect touch device
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

// Use appropriate DnD backend
const Backend = isTouchDevice ? TouchBackend : HTML5Backend
const backendOptions = isTouchDevice ? { enableMouseEvents: true } : {}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DndProvider backend={Backend} options={backendOptions}>
      <App />
    </DndProvider>
  </React.StrictMode>,
)
