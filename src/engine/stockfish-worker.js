/**
 * Stockfish Web Worker
 * This worker loads and runs the Stockfish WASM engine
 */

// For now, we'll use a simplified mock that can be replaced with actual Stockfish
// The real implementation would load stockfish.wasm

let stockfish = null
let isReady = false
let currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

// Simple opening book for more natural play
const OPENING_BOOK = {
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -': ['e2e4', 'd2d4', 'g1f3', 'c2c4'],
    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -': ['e7e5', 'c7c5', 'e7e6', 'd7d5'],
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -': ['g1f3', 'f1c4', 'b1c3'],
}

// Piece values for evaluation
const PIECE_VALUES = {
    'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 0,
    'p': -1, 'n': -3, 'b': -3, 'r': -5, 'q': -9, 'k': 0,
}

let skillLevel = 10

function setSkillLevel(level) {
    skillLevel = level
}

function getBestMove(fen) {
    // Check opening book first
    const fenKey = fen.split(' ').slice(0, 4).join(' ')

    for (const [key, moves] of Object.entries(OPENING_BOOK)) {
        if (fen.startsWith(key.split(' ').slice(0, 4).join(' '))) {
            return moves[Math.floor(Math.random() * moves.length)]
        }
    }

    // For now, return a placeholder - real implementation would calculate
    return 'e2e4' // Fallback
}

function evaluate(fen) {
    // Simple material count evaluation
    let score = 0
    const position = fen.split(' ')[0]
    for (const char of position) {
        if (PIECE_VALUES[char] !== undefined) {
            score += PIECE_VALUES[char]
        }
    }
    return score
}

// Handle messages from main thread
self.onmessage = function (e) {
    const command = e.data

    if (command === 'uci') {
        self.postMessage('id name Stockfish')
        self.postMessage('id author T. Romstad, M. Costalba, J. Kiiski, G. Linscott')
        self.postMessage('uciok')
    }
    else if (command === 'isready') {
        self.postMessage('readyok')
    }
    else if (command === 'ucinewgame') {
        // Reset engine state
        currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    }
    else if (command.startsWith('setoption name Skill Level value')) {
        const level = parseInt(command.split(' ').pop() || '10')
        setSkillLevel(level)
    }
    else if (command.startsWith('position fen')) {
        // Store position for next go command
        currentFen = command.replace('position fen ', '')
    }
    else if (command.startsWith('go')) {
        const fen = currentFen

        // Simulate thinking time
        const thinkTime = 500 + Math.random() * 1000

        setTimeout(() => {
            // Send some info lines
            const evalScore = evaluate(fen)
            self.postMessage(`info depth 10 score cp ${Math.round(evalScore * 100)} nodes 50000`)

            // Send best move
            const move = getBestMove(fen)
            self.postMessage(`bestmove ${move}`)
        }, thinkTime)
    }
    else if (command === 'stop') {
        // Stop calculating
    }
    else if (command === 'quit') {
        self.close()
    }
}

// Signal that we're ready
self.postMessage('readyok')
