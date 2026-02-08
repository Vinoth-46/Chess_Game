import { useState } from 'react'
import { useGameStore } from './store/gameStore'
import { useSettingsStore } from './store/settingsStore'
import { useAI } from './hooks/useAI'
import Board2D from './components/Board/Board2D'
import GameControls from './components/GameControls/GameControls'
import MoveHistory from './components/GameControls/MoveHistory'
import GameHeader from './components/Layout/GameHeader'
import GameModals from './components/Modals/GameModals'
import './styles/App.css'

function App() {
  const { isGameActive } = useGameStore()
  const { theme } = useSettingsStore()
  const [showNewGameModal, setShowNewGameModal] = useState(!isGameActive)

  // Initialize AI - it automatically makes moves when it's AI's turn
  useAI()

  return (
    <div className={`app ${theme}`}>
      <GameHeader onNewGame={() => setShowNewGameModal(true)} />

      <main className="game-container">
        <div className="game-layout">
          <aside className="game-sidebar left">
            <MoveHistory />
          </aside>

          <div className="board-wrapper">
            <Board2D />
          </div>

          <aside className="game-sidebar right">
            <GameControls />
          </aside>
        </div>
      </main>

      <GameModals
        showNewGame={showNewGameModal}
        onCloseNewGame={() => setShowNewGameModal(false)}
      />
    </div>
  )
}

export default App
