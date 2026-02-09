/**
 * Stockfish Chess Engine Worker
 * Handles communication with Stockfish WASM for AI moves and analysis
 */

type MessageHandler = (data: StockfishMessage) => void

interface StockfishMessage {
    type: 'bestmove' | 'info' | 'ready' | 'error'
    move?: string
    evaluation?: number
    depth?: number
    pv?: string[]
    mate?: number
}

interface PendingRequest {
    resolve: (move: string) => void
    reject: (error: Error) => void
}

class StockfishEngine {
    private worker: Worker | null = null
    private isReady: boolean = false
    private messageHandlers: MessageHandler[] = []
    private pendingMove: PendingRequest | null = null
    private currentDepth: number = 10
    private currentMoveTime: number = 2000

    // Difficulty settings map to Stockfish skill level (0-20) and depth
    static DIFFICULTY_SETTINGS = {
        beginner: { skillLevel: 1, depth: 2, errorProbability: 0.5, time: 1000 },
        intermediate: { skillLevel: 8, depth: 8, errorProbability: 0.2, time: 2000 },
        advanced: { skillLevel: 15, depth: 15, errorProbability: 0.05, time: 3000 },
        grandmaster: { skillLevel: 20, depth: 22, errorProbability: 0, time: 5000 },
    }

    async initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // Try to load Stockfish from CDN (stockfish.js npm package or CDN)
                this.worker = new Worker(
                    new URL('./stockfish-worker.js', import.meta.url),
                    { type: 'module' }
                )

                this.worker.onmessage = (event) => {
                    this.handleMessage(event.data)
                }

                this.worker.onerror = (error) => {
                    console.error('Stockfish worker error:', error)
                    reject(error)
                }

                // Send UCI initialization
                this.sendCommand('uci')

                // Wait for ready
                const readyHandler = (msg: StockfishMessage) => {
                    if (msg.type === 'ready') {
                        this.isReady = true
                        this.removeMessageHandler(readyHandler)
                        resolve()
                    }
                }
                this.addMessageHandler(readyHandler)

                // Timeout after 10 seconds
                setTimeout(() => {
                    if (!this.isReady) {
                        reject(new Error('Stockfish initialization timeout'))
                    }
                }, 10000)
            } catch (error) {
                reject(error)
            }
        })
    }

    private handleMessage(data: string): void {
        const message = this.parseUCIMessage(data)
        if (message) {
            this.messageHandlers.forEach(handler => handler(message))

            // Handle best move response
            if (message.type === 'bestmove' && this.pendingMove) {
                this.pendingMove.resolve(message.move!)
                this.pendingMove = null
            }
        }
    }

    private parseUCIMessage(data: string): StockfishMessage | null {
        if (data.startsWith('uciok') || data.startsWith('readyok')) {
            return { type: 'ready' }
        }

        if (data.startsWith('bestmove')) {
            const parts = data.split(' ')
            return {
                type: 'bestmove',
                move: parts[1],
            }
        }

        if (data.startsWith('info')) {
            const message: StockfishMessage = { type: 'info' }

            // Parse depth
            const depthMatch = data.match(/depth (\d+)/)
            if (depthMatch) message.depth = parseInt(depthMatch[1])

            // Parse score
            const cpMatch = data.match(/score cp (-?\d+)/)
            if (cpMatch) message.evaluation = parseInt(cpMatch[1]) / 100

            const mateMatch = data.match(/score mate (-?\d+)/)
            if (mateMatch) message.mate = parseInt(mateMatch[1])

            // Parse principal variation
            const pvMatch = data.match(/pv (.+)$/)
            if (pvMatch) message.pv = pvMatch[1].split(' ')

            return message
        }

        return null
    }

    private sendCommand(command: string): void {
        if (this.worker) {
            this.worker.postMessage(command)
        }
    }

    addMessageHandler(handler: MessageHandler): void {
        this.messageHandlers.push(handler)
    }

    removeMessageHandler(handler: MessageHandler): void {
        const index = this.messageHandlers.indexOf(handler)
        if (index > -1) {
            this.messageHandlers.splice(index, 1)
        }
    }

    setDifficulty(difficulty: keyof typeof StockfishEngine.DIFFICULTY_SETTINGS): void {
        const settings = StockfishEngine.DIFFICULTY_SETTINGS[difficulty]
        this.currentDepth = settings.depth
        this.currentMoveTime = (settings as any).time || 2000
        this.sendCommand(`setoption name Skill Level value ${settings.skillLevel}`)
    }

    async getBestMove(fen: string, timeMs?: number): Promise<string> {
        if (!this.isReady) {
            throw new Error('Stockfish not initialized')
        }

        const moveTime = timeMs || this.currentMoveTime

        return new Promise((resolve, reject) => {
            this.pendingMove = { resolve, reject }

            this.sendCommand('ucinewgame')
            this.sendCommand(`position fen ${fen}`)
            this.sendCommand(`go depth ${this.currentDepth} movetime ${moveTime}`)

            // Timeout
            setTimeout(() => {
                if (this.pendingMove) {
                    this.sendCommand('stop')
                }
            }, moveTime + 1000)
        })
    }

    async evaluatePosition(fen: string): Promise<number> {
        return new Promise((resolve) => {
            let evaluation = 0

            const handler = (msg: StockfishMessage) => {
                if (msg.type === 'info' && msg.evaluation !== undefined) {
                    evaluation = msg.evaluation
                }
                if (msg.type === 'bestmove') {
                    this.removeMessageHandler(handler)
                    resolve(evaluation)
                }
            }

            this.addMessageHandler(handler)
            this.sendCommand(`position fen ${fen}`)
            this.sendCommand('go depth 12')
        })
    }

    startAnalysis(fen: string, depth: number = 22): void {
        if (!this.isReady) return

        // Stop any current calculation
        this.stop()

        this.sendCommand('ucinewgame')
        this.sendCommand(`position fen ${fen}`)
        this.sendCommand(`go depth ${depth}`)
    }

    stop(): void {
        this.sendCommand('stop')
        if (this.pendingMove) {
            this.pendingMove.reject(new Error('Analysis stopped'))
            this.pendingMove = null
        }
    }

    destroy(): void {
        if (this.worker) {
            this.worker.terminate()
            this.worker = null
        }
        this.isReady = false
    }
}

// Singleton instance
let engineInstance: StockfishEngine | null = null

export async function getStockfishEngine(): Promise<StockfishEngine> {
    if (!engineInstance) {
        engineInstance = new StockfishEngine()
        await engineInstance.initialize()
    }
    return engineInstance
}

export { StockfishEngine }
export type { StockfishMessage }
