import React, { useCallback, useMemo, useState } from 'react'
import { useDrop } from 'react-dnd'
import { useGameStore } from '../../store/gameStore'
import { useSettingsStore } from '../../store/settingsStore'
import Square from './Square'
import Piece from '../Pieces/Piece'
import Coordinates from './Coordinates'
import Arrows from './Arrows'
import PromotionModal from './PromotionModal'
import type { Square as SquareType, PieceSymbol } from '../../types/chess'
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
        gameMode,
        playerColor,
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

    // State for promotion modal
    const [promotionSquare, setPromotionSquare] = useState<SquareType | null>(null)
    const [pendingMove, setPendingMove] = useState<{ from: SquareType, to: SquareType } | null>(null)

    // Get current board position
    const board = useMemo(() => chess.board(), [fen])

    // ... existing code ...

    // Check if player can interact with the board
    const canInteract = useCallback((color?: 'w' | 'b') => {
        if (!isGameActive) return false

        // In local/analysis mode, can move both sides
        if (gameMode === 'local' || gameMode === 'analysis') return true

        // In AI/Online mode, can only move own pieces
        const myColor = playerColor === 'white' ? 'w' : 'b'

        // If color provided (piece color), must match player color
        if (color && color !== myColor) return false

        // Must be player's turn
        if (chess.turn() !== myColor) return false

        if (chess.turn() !== myColor) return false

        return true
    }, [isGameActive, gameMode, playerColor, chess])

    // Handle promotion selection
    const handlePromotion = (pieceType: PieceSymbol) => {
        if (pendingMove) {
            makeMove(pendingMove.from, pendingMove.to, pieceType)
        }
        setPromotionSquare(null)
        setPendingMove(null)
    }

    const cancelPromotion = () => {
        setPromotionSquare(null)
        setPendingMove(null)
        // Reset selection to source square
        if (pendingMove) selectSquare(pendingMove.from)
    }

    // Handle piece drop
    const handleDrop = useCallback((from: SquareType, to: SquareType) => {
        const piece = chess.get(from)
        if (!canInteract(piece?.color)) return false

        // Check if promotion is needed
        if (piece?.type === 'p') {
            const toRank = parseInt(to[1])
            if ((piece.color === 'w' && toRank === 8) || (piece.color === 'b' && toRank === 1)) {
                // Open promotion modal
                setPendingMove({ from, to })
                setPromotionSquare(to)
                return true
            }
        }

        return makeMove(from, to)
    }, [chess, makeMove, canInteract])

    // Handle square click
    const handleSquareClick = useCallback((square: SquareType) => {
        // If selecting a piece, check if it's ours
        const piece = chess.get(square)

        // If we are already selecting a piece and clicking empty/opponent square (move attempt)
        if (selectedSquare && !piece) {
            selectSquare(square)
            return
        }

        // If clicking a piece
        if (piece) {
            // If it's our piece, we can select it (if it's our turn)
            if (canInteract(piece.color)) {
                selectSquare(square)
                return
            }

            // If it's opponent piece and we have selection, try to capture
            if (selectedSquare) {
                selectSquare(square)
                return
            }
        }
    }, [chess, selectedSquare, selectSquare, canInteract])

    // Generate squares
    const squares = useMemo(() => {
        const result: any[] = []

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
                                canInteract={canInteract(piece.color)}
                            />
                        )}
                        {promotionSquare === square && (
                            <div style={{ position: 'absolute', zIndex: 100, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                {/* Logic handled by modal overlay, this is just a placeholder anchor */}
                            </div>
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

                {promotionSquare && pendingMove && (
                    <PromotionModal
                        color={chess.turn()}
                        onSelect={handlePromotion}
                        onClose={cancelPromotion}
                    />
                )}
            </div>
            {showCoordinates && <Coordinates isFlipped={isFlipped} theme={boardTheme} />}
        </div>
    )
}

export default Board2D
