import { useState, useEffect, useCallback, useRef } from 'react'
import { getStockfishEngine, StockfishEngine, StockfishMessage } from '../engine/StockfishEngine'
import { useGameStore } from '../store/gameStore'

export interface AnalysisData {
    depth: number
    score: number // cp or mate
    bestMove: string
    pv: string[]
    isMate: boolean
}

export function useAnalysis(active: boolean) {
    const { fen } = useGameStore()
    const engineRef = useRef<StockfishEngine | null>(null)
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null)

    // Initialize engine
    useEffect(() => {
        const init = async () => {
            if (!engineRef.current) {
                try {
                    const engine = await getStockfishEngine()
                    engineRef.current = engine
                } catch (e) {
                    console.error("Failed to init engine", e)
                }
            }
        }
        init()
    }, [])

    const handleMessage = useCallback((msg: StockfishMessage) => {
        if (msg.type === 'info') {
            setAnalysis(prev => {
                const newState: AnalysisData = prev ? { ...prev } : {
                    depth: 0,
                    score: 0,
                    bestMove: '',
                    pv: [],
                    isMate: false
                }

                if (msg.depth) newState.depth = msg.depth

                // Prioritize best move from 'pv' if available
                if (msg.pv && msg.pv.length > 0) {
                    newState.pv = msg.pv
                    newState.bestMove = msg.pv[0]
                }

                if (msg.mate !== undefined) {
                    newState.isMate = true
                    newState.score = msg.mate
                } else if (msg.evaluation !== undefined) {
                    newState.isMate = false
                    newState.score = msg.evaluation
                }

                return newState
            })
        }
    }, [])

    useEffect(() => {
        if (!active || !engineRef.current) return

        const engine = engineRef.current

        // Setup handler
        const handler = (msg: StockfishMessage) => handleMessage(msg)
        engine.addMessageHandler(handler)

        // Start analysis
        engine.startAnalysis(fen, 22)

        return () => {
            engine.removeMessageHandler(handler)
            engine.stop()
        }
    }, [active, fen, handleMessage])

    return { analysis }
}
