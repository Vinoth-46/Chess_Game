import { useCallback, useEffect, useRef, useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { getStockfishEngine, StockfishEngine } from '../engine/StockfishEngine'
import type { AIDifficulty, Square } from '../types/chess'

/**
 * Hook for AI opponent functionality
 * Manages Stockfish engine and AI moves
 */
export function useAI() {
    const engineRef = useRef<StockfishEngine | null>(null)
    const {
        fen,
        getChess,
        gameMode,
        aiDifficulty,
        playerColor,
        isGameActive,
        makeMove
    } = useGameStore()

    const chess = useMemo(() => getChess(), [fen])

    // Initialize engine when needed
    useEffect(() => {
        if (gameMode === 'ai' && !engineRef.current) {
            getStockfishEngine()
                .then(engine => {
                    engineRef.current = engine
                    engine.setDifficulty(aiDifficulty)
                })
                .catch(err => {
                    console.error('Failed to initialize Stockfish:', err)
                })
        }

        return () => {
            // Don't destroy engine on unmount - it's expensive to reinitialize
        }
    }, [gameMode, aiDifficulty])

    // Update difficulty when changed
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.setDifficulty(aiDifficulty)
        }
    }, [aiDifficulty])

    // Make AI move when it's AI's turn
    useEffect(() => {
        if (gameMode !== 'ai' || !isGameActive) return
        if (chess.isGameOver()) return

        const currentTurn = chess.turn()
        const isAITurn = (currentTurn === 'w' && playerColor === 'black') ||
            (currentTurn === 'b' && playerColor === 'white')

        if (!isAITurn) return

        // Add a small delay to make it feel more natural
        const delay = 300 + Math.random() * 700

        const timeoutId = setTimeout(async () => {
            await makeAIMove()
        }, delay)

        return () => clearTimeout(timeoutId)
    }, [fen, gameMode, isGameActive, playerColor])

    const makeAIMove = useCallback(async () => {
        const currentChess = getChess()

        if (!engineRef.current) {
            // Fallback: make a random legal move
            const moves = currentChess.moves({ verbose: true })
            if (moves.length > 0) {
                const randomMove = moves[Math.floor(Math.random() * moves.length)]
                makeMove(randomMove.from as Square, randomMove.to as Square, randomMove.promotion)
            }
            return
        }

        try {
            const moveString = await engineRef.current.getBestMove(currentChess.fen())

            if (moveString && moveString.length >= 4) {
                const from = moveString.slice(0, 2) as Square
                const to = moveString.slice(2, 4) as Square
                const promotion = moveString.length > 4 ? moveString[4] : undefined

                const result = makeMove(from, to, promotion)

                if (!result) {
                    throw new Error(`AI returned illegal move: ${moveString}`)
                }
            }
        } catch (error) {
            console.error('AI move error:', error)

            // Fallback to random move
            const moves = currentChess.moves({ verbose: true })
            if (moves.length > 0) {
                const randomMove = moves[Math.floor(Math.random() * moves.length)]
                makeMove(randomMove.from as Square, randomMove.to as Square, randomMove.promotion)
            }
        }
    }, [fen, makeMove, getChess])

    const getHint = useCallback(async (): Promise<{ from: Square; to: Square } | null> => {
        if (!engineRef.current) return null

        try {
            const currentChess = getChess()
            const moveString = await engineRef.current.getBestMove(currentChess.fen(), 1000)

            if (moveString && moveString.length >= 4) {
                return {
                    from: moveString.slice(0, 2) as Square,
                    to: moveString.slice(2, 4) as Square,
                }
            }
        } catch (error) {
            console.error('Get hint error:', error)
        }

        return null
    }, [fen, getChess])

    const evaluatePosition = useCallback(async (): Promise<number> => {
        if (!engineRef.current) return 0

        try {
            const currentChess = getChess()
            return await engineRef.current.evaluatePosition(currentChess.fen())
        } catch (error) {
            console.error('Evaluate position error:', error)
            return 0
        }
    }, [fen, getChess])

    return {
        makeAIMove,
        getHint,
        evaluatePosition,
        isEngineReady: !!engineRef.current,
    }
}
