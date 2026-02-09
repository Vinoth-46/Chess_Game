import React from 'react'
import { useSettingsStore, BOARD_THEMES } from '../../store/settingsStore'
import './Layout.css'

interface GameHeaderProps {
    onNewGame: () => void
}

const GameHeader: React.FC<GameHeaderProps> = ({ onNewGame }) => {
    const {
        theme,
        setTheme,
        boardTheme,
        setBoardTheme,
        viewMode,
        setViewMode,
        showCoordinates,
        toggleCoordinates,
    } = useSettingsStore()

    return (
        <header className="game-header">
            <div className="header-left">
                <div className="logo">
                    <span className="logo-icon">♔</span>
                    <span className="logo-text">Chess Master Pro</span>
                </div>
            </div>

            <nav className="header-nav">
                <button className="nav-btn primary" onClick={onNewGame}>
                    <span className="icon">+</span>
                    <span>New Game</span>
                </button>
            </nav>

            <div className="header-right">
                {/* Board Theme Selector */}
                <div className="theme-selector">
                    <label>Board:</label>
                    <select
                        value={boardTheme.id}
                        onChange={(e) => {
                            const theme = BOARD_THEMES.find(t => t.id === e.target.value)
                            if (theme) setBoardTheme(theme)
                        }}
                    >
                        {BOARD_THEMES.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>

                {/* View Mode Toggle */}
                <div className="view-toggle">
                    <button
                        className={`setting-btn ${viewMode === '2d' ? 'active' : ''}`}
                        onClick={() => setViewMode('2d')}
                        title="2D View"
                    >
                        2D
                    </button>
                    <button
                        className={`setting-btn ${viewMode === '3d' ? 'active' : ''}`}
                        onClick={() => setViewMode('3d')}
                        title="3D View"
                    >
                        3D
                    </button>
                </div>

                {/* Coordinates Toggle */}
                <button
                    className={`setting-btn ${showCoordinates ? 'active' : ''}`}
                    onClick={toggleCoordinates}
                    title="Toggle Coordinates"
                >
                    A1
                </button>

                {/* Theme Toggle */}
                <button
                    className="setting-btn theme-toggle"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>
        </header>
    )
}

export default GameHeader
