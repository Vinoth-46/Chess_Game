import React from 'react'
import { useGameStore } from '../../store/gameStore'
import { useSettingsStore } from '../../store/settingsStore'
import Timer from './Timer'
import './GameControls.css'

const GameControls: React.FC = () => {
    const {
        fen,
        getChess,
        isGameActive,
        gameMode,
        undoMove,
        resignGame,
        offerDraw,
        flipBoard,
        whiteTime,
        blackTime,
        timerEnabled,
        newGame,
    } = useGameStore()

    const chess = getChess()

    const { soundEnabled, toggleSound } = useSettingsStore()

    const isGameOver = chess.isGameOver()
    const turn = chess.turn()

    // Get game status text
    const getStatusText = () => {
        if (chess.isCheckmate()) {
            return `Checkmate! ${turn === 'w' ? 'Black' : 'White'} wins!`
        }
        if (chess.isStalemate()) {
            return 'Stalemate - Draw!'
        }
        if (chess.isDraw()) {
            return 'Draw!'
        }
        if (chess.inCheck()) {
            return `${turn === 'w' ? 'White' : 'Black'} is in check!`
        }
        return `${turn === 'w' ? 'White' : 'Black'} to move`
    }

    return (
        <div className="game-controls">
            {/* Opponent Timer (top) */}
            {timerEnabled && (
                <Timer
                    time={blackTime}
                    isActive={isGameActive && turn === 'b' && !isGameOver}
                    player="black"
                />
            )}

            {/* Game Status */}
            <div className={`game-status ${chess.inCheck() ? 'check' : ''} ${isGameOver ? 'game-over' : ''}`}>
                <span className="status-text">{getStatusText()}</span>
            </div>

            {/* Control Buttons */}
            <div className="control-buttons">
                {isGameActive && !isGameOver && (
                    <>
                        {gameMode === 'local' && (
                            <button
                                className="control-btn undo"
                                onClick={undoMove}
                                title="Undo Move"
                            >
                                <span className="icon">↩</span>
                                <span className="label">Undo</span>
                            </button>
                        )}

                        <button
                            className="control-btn flip"
                            onClick={flipBoard}
                            title="Flip Board"
                        >
                            <span className="icon">🔄</span>
                            <span className="label">Flip</span>
                        </button>

                        <button
                            className="control-btn draw"
                            onClick={offerDraw}
                            title="Offer Draw"
                        >
                            <span className="icon">🤝</span>
                            <span className="label">Draw</span>
                        </button>

                        <button
                            className="control-btn resign"
                            onClick={resignGame}
                            title="Resign"
                        >
                            <span className="icon">🏳️</span>
                            <span className="label">Resign</span>
                        </button>
                    </>
                )}

                {isGameOver && (
                    <button
                        className="control-btn new-game primary"
                        onClick={() => newGame({ mode: gameMode })}
                        title="New Game"
                    >
                        <span className="icon">♟</span>
                        <span className="label">New Game</span>
                    </button>
                )}

                <button
                    className={`control-btn sound ${soundEnabled ? 'active' : ''}`}
                    onClick={toggleSound}
                    title={soundEnabled ? 'Mute' : 'Unmute'}
                >
                    <span className="icon">{soundEnabled ? '🔊' : '🔇'}</span>
                </button>
            </div>

            {/* Player Timer (bottom) */}
            {timerEnabled && (
                <Timer
                    time={whiteTime}
                    isActive={isGameActive && turn === 'w' && !isGameOver}
                    player="white"
                />
            )}
        </div>
    )
}

export default GameControls
