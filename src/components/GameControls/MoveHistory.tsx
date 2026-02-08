import React, { useRef, useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import './GameControls.css'

const MoveHistory: React.FC = () => {
    const { moveHistory, currentMoveIndex, goToMove } = useGameStore()
    const listRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when new moves are added
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight
        }
    }, [moveHistory.length])

    // Group moves into pairs (White, Black)
    const movePairs: Array<{ moveNumber: number; white?: string; black?: string; whiteIndex: number; blackIndex: number }> = []

    for (let i = 0; i < moveHistory.length; i += 2) {
        movePairs.push({
            moveNumber: Math.floor(i / 2) + 1,
            white: moveHistory[i]?.san,
            black: moveHistory[i + 1]?.san,
            whiteIndex: i,
            blackIndex: i + 1,
        })
    }

    if (moveHistory.length === 0) {
        return (
            <div className="move-history">
                <div className="history-header">
                    <h3>Moves</h3>
                </div>
                <div className="history-empty">
                    <span>No moves yet</span>
                    <span className="hint">Make your first move!</span>
                </div>
            </div>
        )
    }

    return (
        <div className="move-history">
            <div className="history-header">
                <h3>Moves</h3>
                <span className="move-count">{moveHistory.length} moves</span>
            </div>

            <div className="history-list" ref={listRef}>
                {movePairs.map(({ moveNumber, white, black, whiteIndex, blackIndex }) => (
                    <div key={moveNumber} className="move-pair">
                        <span className="move-number">{moveNumber}.</span>
                        {white && (
                            <button
                                className={`move white ${currentMoveIndex === whiteIndex ? 'current' : ''}`}
                                onClick={() => goToMove(whiteIndex)}
                            >
                                {white}
                            </button>
                        )}
                        {black && (
                            <button
                                className={`move black ${currentMoveIndex === blackIndex ? 'current' : ''}`}
                                onClick={() => goToMove(blackIndex)}
                            >
                                {black}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="history-navigation">
                <button
                    className="nav-btn"
                    onClick={() => goToMove(-1)}
                    disabled={currentMoveIndex < 0}
                    title="Go to start"
                >
                    ⏮
                </button>
                <button
                    className="nav-btn"
                    onClick={() => goToMove(Math.max(-1, currentMoveIndex - 1))}
                    disabled={currentMoveIndex < 0}
                    title="Previous move"
                >
                    ◀
                </button>
                <button
                    className="nav-btn"
                    onClick={() => goToMove(Math.min(moveHistory.length - 1, currentMoveIndex + 1))}
                    disabled={currentMoveIndex >= moveHistory.length - 1}
                    title="Next move"
                >
                    ▶
                </button>
                <button
                    className="nav-btn"
                    onClick={() => goToMove(moveHistory.length - 1)}
                    disabled={currentMoveIndex >= moveHistory.length - 1}
                    title="Go to end"
                >
                    ⏭
                </button>
            </div>
        </div>
    )
}

export default MoveHistory
