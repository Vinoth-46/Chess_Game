import React, { useCallback, useMemo } from 'react'
import { useDrop } from 'react-dnd'
import { useGameStore } from '../../store/gameStore'
import { useSettingsStore } from '../../store/settingsStore'
import Square from './Square'
import Piece from '../Pieces/Piece'
import Coordinates from './Coordinates'
import Arrows from './Arrows'
import type { Square as SquareType } from '../../types/chess'
import './Board.css'

const Board2D: React.FC = () => {
    const {
        fen,
        getChess,
        isFlipped,
        selectedSquare,
        legalMoves,
        highlights,
        arrows,
        makeMove,
        selectSquare,
        isGameActive,
    } = useGameStore()

    const chess = getChess()

    const {
        boardTheme,
        showCoordinates,
        showLegalMoves,
        showLastMove,
        highlightCheck,
        largeBoard,
    } = useSettingsStore()

    // Get current board position
    const board = useMemo(() => chess.board(), [fen])

    // Handle piece drop
    const handleDrop = useCallback((from: SquareType, to: SquareType) => {
        if (!isGameActive) return false

        // Check if promotion is needed
        const piece = chess.get(from)
        if (piece?.type === 'p') {
            const toRank = parseInt(to[1])
            if ((piece.color === 'w' && toRank === 8) || (piece.color === 'b' && toRank === 1)) {
                // For now, auto-promote to queen
                // TODO: Add promotion modal
                return makeMove(from, to, 'q')
            }
        }

        return makeMove(from, to)
    }, [fen, makeMove, isGameActive])

    // Handle square click
    const handleSquareClick = useCallback((square: SquareType) => {
        if (!isGameActive) return
        selectSquare(square)
    }, [selectSquare, isGameActive])

    // Generate squares
    const squares = useMemo(() => {
        const result: JSX.Element[] = []

        for (let rank = 7; rank >= 0; rank--) {
            for (let file = 0; file < 8; file++) {
                const displayRank = isFlipped ? 7 - rank : rank
                const displayFile = isFlipped ? 7 - file : file

                const square = `${String.fromCharCode(97 + displayFile)}${displayRank + 1}` as SquareType
                const isLight = (displayFile + displayRank) % 2 === 1
                const piece = board[7 - displayRank]?.[displayFile]

                // Determine highlights
                const isSelected = selectedSquare === square
                const isLegalMove = showLegalMoves && legalMoves.includes(square)
                const highlight = highlights.find(h => h.square === square)
                const isLastMove = showLastMove && highlight?.type === 'lastMove'
                const isCheck = highlightCheck && highlight?.type === 'check'

                result.push(
                    <Square
                        key={square}
                        square={square}
                        isLight={isLight}
                        isSelected={isSelected}
                        isLegalMove={isLegalMove}
                        isLastMove={isLastMove}
                        isCheck={isCheck}
                        hasPiece={!!piece}
                        theme={boardTheme}
                        onClick={() => handleSquareClick(square)}
                        onDrop={handleDrop}
                    >
                        {piece && (
                            <Piece
                                type={piece.type}
                                color={piece.color}
                                square={square}
                                isSelected={isSelected}
                            />
                        )}
                    </Square>
                )
            }
        }

        return result
    }, [
        board,
        isFlipped,
        selectedSquare,
        legalMoves,
        highlights,
        boardTheme,
        showLegalMoves,
        showLastMove,
        highlightCheck,
        handleSquareClick,
        handleDrop,
    ])

    return (
        <div className={`board-container ${largeBoard ? 'large' : ''}`}>
            <div
                className="board"
                style={{
                    '--light-square': boardTheme.lightSquare,
                    '--dark-square': boardTheme.darkSquare,
                    '--selected': boardTheme.selected,
                    '--legal-move': boardTheme.legalMove,
                    '--last-move': boardTheme.lastMove,
                    '--check': boardTheme.check,
                } as React.CSSProperties}
            >
                {squares}
                <Arrows arrows={arrows} isFlipped={isFlipped} />
            </div>
            {showCoordinates && <Coordinates isFlipped={isFlipped} theme={boardTheme} />}
        </div>
    )
}

export default Board2D
