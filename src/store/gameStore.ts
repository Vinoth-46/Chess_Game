import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Chess } from 'chess.js'
import type {
    GameMode,
    GameMove,
    GameConfig,
    AIDifficulty,
    Player,
    Square,
    SquareHighlight,
    Arrow
} from '../types/chess'

interface GameStore {
    // Chess FEN (for persistence - Chess instance is derived)
    fen: string

    // Game configuration
    gameMode: GameMode
    aiDifficulty: AIDifficulty
    playerColor: Player
    isGameActive: boolean

    // Move history and state
    moveHistory: GameMove[]
    currentMoveIndex: number

    // Timer
    whiteTime: number
    blackTime: number
    timerEnabled: boolean
    initialTime: number
    increment: number

    // UI state
    selectedSquare: Square | null
    legalMoves: Square[]
    highlights: SquareHighlight[]
    arrows: Arrow[]
    isFlipped: boolean

    // Multiplayer
    roomCode: string | null
    opponentName: string | null

    // Computed - Chess instance (not persisted)
    getChess: () => Chess

    // Actions
    newGame: (config: GameConfig) => void
    makeMove: (from: Square, to: Square, promotion?: string) => boolean
    selectSquare: (square: Square | null) => void
    undoMove: () => void
    resignGame: () => void
    offerDraw: () => void
    flipBoard: () => void
    goToMove: (index: number) => void
    setHighlights: (highlights: SquareHighlight[]) => void
    setArrows: (arrows: Arrow[]) => void
    updateTimer: (color: Player, time: number) => void
    resetGame: () => void
}

const DEFAULT_TIME = 10 * 60 * 1000 // 10 minutes
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

// Create a single Chess instance that we reuse
let chessInstance: Chess | null = null

function getOrCreateChess(fen: string): Chess {
    if (!chessInstance) {
        chessInstance = new Chess(fen)
    } else if (chessInstance.fen() !== fen) {
        chessInstance.load(fen)
    }
    return chessInstance
}

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            // Initial state
            fen: STARTING_FEN,
            gameMode: 'local',
            aiDifficulty: 'intermediate',
            playerColor: 'white',
            isGameActive: false,
            moveHistory: [],
            currentMoveIndex: -1,
            whiteTime: DEFAULT_TIME,
            blackTime: DEFAULT_TIME,
            timerEnabled: true,
            initialTime: DEFAULT_TIME,
            increment: 0,
            selectedSquare: null,
            legalMoves: [],
            highlights: [],
            arrows: [],
            isFlipped: false,
            roomCode: null,
            opponentName: null,

            // Get Chess instance (computed from FEN)
            getChess: () => getOrCreateChess(get().fen),

            // Start a new game
            newGame: (config) => {
                chessInstance = new Chess()

                set({
                    fen: chessInstance.fen(),
                    gameMode: config.mode,
                    aiDifficulty: config.aiDifficulty || 'intermediate',
                    playerColor: config.playerColor || 'white',
                    isGameActive: true,
                    moveHistory: [],
                    currentMoveIndex: -1,
                    whiteTime: config.timer?.initialTime || DEFAULT_TIME,
                    blackTime: config.timer?.initialTime || DEFAULT_TIME,
                    timerEnabled: !!config.timer,
                    initialTime: config.timer?.initialTime || DEFAULT_TIME,
                    increment: config.timer?.increment || 0,
                    selectedSquare: null,
                    legalMoves: [],
                    highlights: [],
                    arrows: [],
                    isFlipped: config.playerColor === 'black',
                    roomCode: config.roomCode || null,
                })
            },

            // Make a move
            makeMove: (from, to, promotion) => {
                const { increment } = get()
                const chess = get().getChess()

                try {
                    const move = chess.move({ from, to, promotion: promotion as any })

                    if (move) {
                        const gameMove: GameMove = {
                            from,
                            to,
                            promotion: promotion as any,
                            san: move.san,
                            fen: chess.fen(),
                            timestamp: Date.now(),
                        }

                        const newHistory = [...get().moveHistory, gameMove]

                        // Add increment to the player who just moved
                        const colorMoved = move.color === 'w' ? 'white' : 'black'

                        set((state) => ({
                            fen: chess.fen(),
                            moveHistory: newHistory,
                            currentMoveIndex: newHistory.length - 1,
                            selectedSquare: null,
                            legalMoves: [],
                            highlights: [
                                { square: from, type: 'lastMove' },
                                { square: to, type: 'lastMove' },
                                ...(chess.inCheck() ? [{ square: findKingSquare(chess, chess.turn()), type: 'check' as const }] : []),
                            ],
                            whiteTime: colorMoved === 'white' ? state.whiteTime + increment : state.whiteTime,
                            blackTime: colorMoved === 'black' ? state.blackTime + increment : state.blackTime,
                        }))

                        return true
                    }
                } catch (e) {
                    console.error('Invalid move:', e)
                }

                return false
            },

            // Select a square
            selectSquare: (square) => {
                const { selectedSquare, legalMoves, makeMove } = get()
                const chess = get().getChess()

                if (!square) {
                    set({ selectedSquare: null, legalMoves: [] })
                    return
                }

                // If clicking on same square, deselect
                if (selectedSquare === square) {
                    set({ selectedSquare: null, legalMoves: [] })
                    return
                }

                // If a piece is already selected, check if this is a legal move
                if (selectedSquare) {
                    // Only attempt move if target square is in legalMoves
                    if (legalMoves.includes(square)) {
                        makeMove(selectedSquare, square)
                        return
                    }

                    // If move is not legal, check if clicking on own piece to select it
                    const piece = chess.get(square)
                    if (piece && piece.color === chess.turn()) {
                        const moves = chess.moves({ square, verbose: true })
                        set({
                            selectedSquare: square,
                            legalMoves: moves.map(m => m.to),
                        })
                    } else {
                        // Clicked on empty square or opponent's piece - deselect
                        set({ selectedSquare: null, legalMoves: [] })
                    }
                    return
                }

                // Select the square if it has a piece of the current player
                const piece = chess.get(square)
                if (piece && piece.color === chess.turn()) {
                    const moves = chess.moves({ square, verbose: true })
                    set({
                        selectedSquare: square,
                        legalMoves: moves.map(m => m.to),
                    })
                }
            },

            // Undo last move
            undoMove: () => {
                const { moveHistory } = get()
                const chess = get().getChess()
                const undone = chess.undo()

                if (undone) {
                    const newHistory = moveHistory.slice(0, -1)
                    set({
                        fen: chess.fen(),
                        moveHistory: newHistory,
                        currentMoveIndex: newHistory.length - 1,
                        selectedSquare: null,
                        legalMoves: [],
                        highlights: newHistory.length > 0
                            ? [
                                { square: newHistory[newHistory.length - 1].from, type: 'lastMove' },
                                { square: newHistory[newHistory.length - 1].to, type: 'lastMove' },
                            ]
                            : [],
                    })
                }
            },

            // Resign the game
            resignGame: () => {
                set({ isGameActive: false })
            },

            // Offer a draw
            offerDraw: () => {
                // In local mode, just end the game as draw
                // In online mode, this would send a draw offer
                const { gameMode } = get()
                if (gameMode === 'local') {
                    set({ isGameActive: false })
                }
            },

            // Flip the board
            flipBoard: () => {
                set((state) => ({ isFlipped: !state.isFlipped }))
            },

            // Navigate to a specific move
            goToMove: (index) => {
                const { moveHistory } = get()
                const chess = new Chess()

                // Replay moves up to the specified index
                for (let i = 0; i <= index && i < moveHistory.length; i++) {
                    chess.move({
                        from: moveHistory[i].from,
                        to: moveHistory[i].to,
                        promotion: moveHistory[i].promotion,
                    })
                }

                chessInstance = chess

                set({
                    fen: chess.fen(),
                    currentMoveIndex: index,
                    highlights: index >= 0
                        ? [
                            { square: moveHistory[index].from, type: 'lastMove' },
                            { square: moveHistory[index].to, type: 'lastMove' },
                        ]
                        : [],
                })
            },

            // Set highlights
            setHighlights: (highlights) => set({ highlights }),

            // Set arrows
            setArrows: (arrows) => set({ arrows }),

            // Update timer
            updateTimer: (color, time) => {
                if (color === 'white') {
                    set({ whiteTime: time })
                } else {
                    set({ blackTime: time })
                }
            },

            // Reset game
            resetGame: () => {
                chessInstance = new Chess()
                set({
                    fen: STARTING_FEN,
                    isGameActive: false,
                    moveHistory: [],
                    currentMoveIndex: -1,
                    whiteTime: DEFAULT_TIME,
                    blackTime: DEFAULT_TIME,
                    selectedSquare: null,
                    legalMoves: [],
                    highlights: [],
                    arrows: [],
                })
            },
        }),
        {
            name: 'chess-game-state',
            storage: createJSONStorage(() => localStorage),
            // Only persist these fields (exclude transient UI state)
            partialize: (state) => ({
                fen: state.fen,
                gameMode: state.gameMode,
                aiDifficulty: state.aiDifficulty,
                playerColor: state.playerColor,
                isGameActive: state.isGameActive,
                moveHistory: state.moveHistory,
                currentMoveIndex: state.currentMoveIndex,
                whiteTime: state.whiteTime,
                blackTime: state.blackTime,
                timerEnabled: state.timerEnabled,
                initialTime: state.initialTime,
                increment: state.increment,
                isFlipped: state.isFlipped,
                roomCode: state.roomCode,
            }),
        }
    )
)

// Helper function to find king square
function findKingSquare(chess: Chess, color: 'w' | 'b'): Square {
    const board = chess.board()
    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const piece = board[rank][file]
            if (piece && piece.type === 'k' && piece.color === color) {
                return `${String.fromCharCode(97 + file)}${8 - rank}` as Square
            }
        }
    }
    return 'e1' as Square // Fallback (should never happen)
}

// For backwards compatibility - expose chess getter
// Components should use store.getChess() instead of store.chess
export const getChessFromStore = () => {
    const state = useGameStore.getState()
    return getOrCreateChess(state.fen)
}
