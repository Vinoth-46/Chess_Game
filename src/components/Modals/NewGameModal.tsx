import React, { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useSettingsStore } from '../../store/settingsStore'
import type { GameMode, AIDifficulty, Player, TimerConfig } from '../../types/chess'
import './Modals.css'

interface NewGameModalProps {
    onClose: () => void
}

const TIME_CONTROLS: { label: string; config: TimerConfig | null }[] = [
    { label: 'No Timer', config: null },
    { label: 'Bullet 1min', config: { initialTime: 60000, increment: 0 } },
    { label: 'Bullet 2min', config: { initialTime: 120000, increment: 1000 } },
    { label: 'Blitz 3min', config: { initialTime: 180000, increment: 0 } },
    { label: 'Blitz 5min', config: { initialTime: 300000, increment: 0 } },
    { label: 'Rapid 10min', config: { initialTime: 600000, increment: 0 } },
    { label: 'Rapid 15|10', config: { initialTime: 900000, increment: 10000 } },
    { label: 'Classical 30min', config: { initialTime: 1800000, increment: 0 } },
]

const AI_DIFFICULTIES: { value: AIDifficulty; label: string; description: string }[] = [
    { value: 'beginner', label: 'Beginner', description: 'Makes frequent mistakes, perfect for learning' },
    { value: 'intermediate', label: 'Intermediate', description: 'Plays reasonable chess with occasional errors' },
    { value: 'advanced', label: 'Advanced', description: 'Strong player with tactical awareness' },
    { value: 'grandmaster', label: 'Grandmaster', description: 'Maximum difficulty, plays near-perfect chess' },
]

const NewGameModal: React.FC<NewGameModalProps> = ({ onClose }) => {
    const { newGame } = useGameStore()
    const { defaultAIDifficulty } = useSettingsStore()

    const [mode, setMode] = useState<GameMode>('local')
    const [timeControl, setTimeControl] = useState<number>(4) // Default to 5min
    const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>(defaultAIDifficulty)
    const [playerColor, setPlayerColor] = useState<Player | 'random'>('white')
    const [roomCode, setRoomCode] = useState('')

    const handleStartGame = () => {
        const color = playerColor === 'random'
            ? (Math.random() > 0.5 ? 'white' : 'black') as Player
            : playerColor

        newGame({
            mode,
            timer: TIME_CONTROLS[timeControl].config || undefined,
            aiDifficulty: mode === 'ai' ? aiDifficulty : undefined,
            playerColor: color,
            roomCode: mode === 'online' ? roomCode : undefined,
        })

        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>New Game</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {/* Game Mode Selection */}
                    <div className="form-group">
                        <label>Game Mode</label>
                        <div className="mode-grid">
                            <button
                                className={`mode-btn ${mode === 'local' ? 'active' : ''}`}
                                onClick={() => setMode('local')}
                            >
                                <span className="mode-icon">👥</span>
                                <span className="mode-label">Local</span>
                                <span className="mode-desc">Play on same device</span>
                            </button>
                            <button
                                className={`mode-btn ${mode === 'ai' ? 'active' : ''}`}
                                onClick={() => setMode('ai')}
                            >
                                <span className="mode-icon">🤖</span>
                                <span className="mode-label">vs AI</span>
                                <span className="mode-desc">Play against computer</span>
                            </button>
                            <button
                                className={`mode-btn ${mode === 'online' ? 'active' : ''}`}
                                onClick={() => setMode('online')}
                            >
                                <span className="mode-icon">🌐</span>
                                <span className="mode-label">Online</span>
                                <span className="mode-desc">Play with friends</span>
                            </button>
                            <button
                                className={`mode-btn ${mode === 'analysis' ? 'active' : ''}`}
                                onClick={() => setMode('analysis')}
                            >
                                <span className="mode-icon">🔍</span>
                                <span className="mode-label">Analysis</span>
                                <span className="mode-desc">Study positions</span>
                            </button>
                        </div>
                    </div>

                    {/* Online Room Code */}
                    {mode === 'online' && (
                        <div className="form-group">
                            <label>Room Code (optional)</label>
                            <input
                                type="text"
                                placeholder="Enter code to join, or leave empty to create"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                className="room-code-input"
                            />
                        </div>
                    )}

                    {/* AI Difficulty */}
                    {mode === 'ai' && (
                        <div className="form-group">
                            <label>AI Difficulty</label>
                            <div className="difficulty-grid">
                                {AI_DIFFICULTIES.map(diff => (
                                    <button
                                        key={diff.value}
                                        className={`difficulty-btn ${aiDifficulty === diff.value ? 'active' : ''}`}
                                        onClick={() => setAiDifficulty(diff.value)}
                                    >
                                        <span className="diff-label">{diff.label}</span>
                                        <span className="diff-desc">{diff.description}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Time Control */}
                    {mode !== 'analysis' && (
                        <div className="form-group">
                            <label>Time Control</label>
                            <div className="time-grid">
                                {TIME_CONTROLS.map((tc, index) => (
                                    <button
                                        key={tc.label}
                                        className={`time-btn ${timeControl === index ? 'active' : ''}`}
                                        onClick={() => setTimeControl(index)}
                                    >
                                        {tc.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Player Color */}
                    {mode === 'ai' && (
                        <div className="form-group">
                            <label>Play as</label>
                            <div className="color-grid">
                                <button
                                    className={`color-btn ${playerColor === 'white' ? 'active' : ''}`}
                                    onClick={() => setPlayerColor('white')}
                                >
                                    <span className="color-icon white">♔</span>
                                    <span>White</span>
                                </button>
                                <button
                                    className={`color-btn ${playerColor === 'random' ? 'active' : ''}`}
                                    onClick={() => setPlayerColor('random')}
                                >
                                    <span className="color-icon random">🎲</span>
                                    <span>Random</span>
                                </button>
                                <button
                                    className={`color-btn ${playerColor === 'black' ? 'active' : ''}`}
                                    onClick={() => setPlayerColor('black')}
                                >
                                    <span className="color-icon black">♚</span>
                                    <span>Black</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn primary" onClick={handleStartGame}>
                        Start Game
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NewGameModal
