import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BoardTheme, PieceTheme, AIDifficulty } from '../types/chess'

// Board themes
export const BOARD_THEMES: BoardTheme[] = [
    {
        id: 'classic',
        name: 'Classic Wood',
        lightSquare: '#f0d9b5',
        darkSquare: '#b58863',
        selected: 'rgba(20, 85, 30, 0.5)',
        legalMove: 'rgba(20, 85, 30, 0.4)',
        lastMove: 'rgba(155, 199, 0, 0.41)',
        check: 'rgba(255, 0, 0, 0.5)',
    },
    {
        id: 'marble',
        name: 'Marble',
        lightSquare: '#e8e8e8',
        darkSquare: '#7d8796',
        selected: 'rgba(0, 100, 150, 0.5)',
        legalMove: 'rgba(0, 100, 150, 0.3)',
        lastMove: 'rgba(0, 150, 200, 0.4)',
        check: 'rgba(220, 50, 50, 0.5)',
    },
    {
        id: 'tournament',
        name: 'Tournament Green',
        lightSquare: '#ffffdd',
        darkSquare: '#86a666',
        selected: 'rgba(255, 255, 0, 0.4)',
        legalMove: 'rgba(255, 255, 0, 0.25)',
        lastMove: 'rgba(255, 255, 0, 0.35)',
        check: 'rgba(255, 50, 50, 0.5)',
    },
    {
        id: 'midnight',
        name: 'Midnight Blue',
        lightSquare: '#dee3e6',
        darkSquare: '#4b648a',
        selected: 'rgba(100, 200, 255, 0.5)',
        legalMove: 'rgba(100, 200, 255, 0.3)',
        lastMove: 'rgba(100, 200, 255, 0.35)',
        check: 'rgba(255, 80, 80, 0.5)',
    },
    {
        id: 'coral',
        name: 'Coral',
        lightSquare: '#f5deb3',
        darkSquare: '#cd853f',
        selected: 'rgba(255, 127, 80, 0.5)',
        legalMove: 'rgba(255, 127, 80, 0.3)',
        lastMove: 'rgba(255, 165, 0, 0.4)',
        check: 'rgba(220, 20, 60, 0.5)',
    },
]

// Piece themes
export const PIECE_THEMES: PieceTheme[] = [
    { id: 'neo', name: 'Neo', path: '/pieces/neo' },
    { id: 'classic', name: 'Classic', path: '/pieces/classic' },
    { id: 'alpha', name: 'Alpha', path: '/pieces/alpha' },
]

type UITheme = 'dark' | 'light' | 'system'
type ViewMode = '2d' | '2.5d' | '3d'

interface SettingsStore {
    // Theme
    theme: UITheme
    boardTheme: BoardTheme
    pieceTheme: PieceTheme

    // View
    viewMode: ViewMode
    showCoordinates: boolean
    showLegalMoves: boolean
    showLastMove: boolean
    highlightCheck: boolean

    // Sound
    soundEnabled: boolean
    soundVolume: number

    // Accessibility
    largeBoard: boolean
    highContrast: boolean

    // AI defaults
    defaultAIDifficulty: AIDifficulty

    // Actions
    setTheme: (theme: UITheme) => void
    setBoardTheme: (theme: BoardTheme) => void
    setPieceTheme: (theme: PieceTheme) => void
    setViewMode: (mode: ViewMode) => void
    toggleCoordinates: () => void
    toggleLegalMoves: () => void
    toggleLastMove: () => void
    toggleHighlightCheck: () => void
    toggleSound: () => void
    setSoundVolume: (volume: number) => void
    toggleLargeBoard: () => void
    toggleHighContrast: () => void
    setDefaultAIDifficulty: (difficulty: AIDifficulty) => void
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            // Initial state
            theme: 'dark',
            boardTheme: BOARD_THEMES[0],
            pieceTheme: PIECE_THEMES[0],
            viewMode: '2d',
            showCoordinates: true,
            showLegalMoves: true,
            showLastMove: true,
            highlightCheck: true,
            soundEnabled: true,
            soundVolume: 0.7,
            largeBoard: false,
            highContrast: false,
            defaultAIDifficulty: 'intermediate',

            // Actions
            setTheme: (theme) => set({ theme }),
            setBoardTheme: (boardTheme) => set({ boardTheme }),
            setPieceTheme: (pieceTheme) => set({ pieceTheme }),
            setViewMode: (viewMode) => set({ viewMode }),
            toggleCoordinates: () => set((s) => ({ showCoordinates: !s.showCoordinates })),
            toggleLegalMoves: () => set((s) => ({ showLegalMoves: !s.showLegalMoves })),
            toggleLastMove: () => set((s) => ({ showLastMove: !s.showLastMove })),
            toggleHighlightCheck: () => set((s) => ({ highlightCheck: !s.highlightCheck })),
            toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
            setSoundVolume: (soundVolume) => set({ soundVolume }),
            toggleLargeBoard: () => set((s) => ({ largeBoard: !s.largeBoard })),
            toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
            setDefaultAIDifficulty: (defaultAIDifficulty) => set({ defaultAIDifficulty }),
        }),
        {
            name: 'chess-settings',
        }
    )
)
