import { Chess, type Square, type Move, type PieceSymbol } from 'chess.js'

// Define Color type ourselves since chess.js doesn't export it as a type
export type Color = 'w' | 'b'

// Re-export chess.js types
export type { Square, Move, PieceSymbol }
export { Chess }

// Custom types
export type Player = 'white' | 'black'

export type GameMode =
    | 'local'       // Player vs Player (Local)
    | 'online'      // Player vs Player (Online)
    | 'ai'          // Player vs AI
    | 'puzzle'      // Puzzle Mode
    | 'analysis'    // Analysis Mode
    | 'training'    // Training Mode

export type AIDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'grandmaster'

export type GameStatus =
    | 'waiting'     // Waiting for game to start
    | 'active'      // Game in progress
    | 'check'       // King is in check
    | 'checkmate'   // Checkmate
    | 'stalemate'   // Stalemate
    | 'draw'        // Draw (various reasons)
    | 'resigned'    // Player resigned
    | 'timeout'     // Player ran out of time

export interface GameState {
    fen: string
    turn: Color
    moveNumber: number
    isCheck: boolean
    isCheckmate: boolean
    isStalemate: boolean
    isDraw: boolean
    isGameOver: boolean
}

export interface GameMove {
    from: Square
    to: Square
    promotion?: PieceSymbol
    san: string
    fen: string
    timestamp: number
    evaluation?: number
    quality?: MoveQuality
}

export type MoveQuality =
    | 'brilliant'
    | 'great'
    | 'good'
    | 'book'
    | 'inaccuracy'
    | 'mistake'
    | 'blunder'

export interface PlayerInfo {
    id: string
    name: string
    rating?: number
    color: Player
    timeRemaining: number
}

export interface TimerConfig {
    initialTime: number     // in milliseconds
    increment: number       // in milliseconds
}

export interface GameConfig {
    mode: GameMode
    timer?: TimerConfig
    aiDifficulty?: AIDifficulty
    playerColor?: Player
    roomCode?: string
}

export interface SquareHighlight {
    square: Square
    type: 'selected' | 'legal' | 'lastMove' | 'check' | 'premove'
}

export interface Arrow {
    from: Square
    to: Square
    color: string
}

export interface BoardTheme {
    id: string
    name: string
    lightSquare: string
    darkSquare: string
    selected: string
    legalMove: string
    lastMove: string
    check: string
}

export interface PieceTheme {
    id: string
    name: string
    path: string
}

// Piece definitions for rendering
export const PIECE_NAMES: Record<PieceSymbol, string> = {
    p: 'pawn',
    n: 'knight',
    b: 'bishop',
    r: 'rook',
    q: 'queen',
    k: 'king',
}

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const

// Convert square to coordinates
export function squareToCoords(square: Square): { file: number; rank: number } {
    const file = square.charCodeAt(0) - 97 // 'a' = 0, 'h' = 7
    const rank = parseInt(square[1]) - 1   // '1' = 0, '8' = 7
    return { file, rank }
}

// Convert coordinates to square
export function coordsToSquare(file: number, rank: number): Square {
    return `${String.fromCharCode(97 + file)}${rank + 1}` as Square
}
