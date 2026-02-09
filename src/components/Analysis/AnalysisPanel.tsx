import React from 'react'
import { useGameStore } from '../../store/gameStore'
import { useAnalysis } from '../../hooks/useAnalysis'
import './AnalysisPanel.css'

const AnalysisPanel: React.FC = () => {
    const { gameMode } = useGameStore()
    const { analysis } = useAnalysis(gameMode === 'analysis')

    if (gameMode !== 'analysis') return null

    const getEvalText = () => {
        if (!analysis) return 'Calculating...'
        if (analysis.isMate) {
            return `Mate in ${Math.abs(analysis.score)}`
        }
        return analysis.score > 0 ? `+${analysis.score.toFixed(2)}` : analysis.score.toFixed(2)
    }

    // Calculate percentage for evaluation bar (cap at +/- 10)
    const getEvalPercent = () => {
        if (!analysis) return 50
        if (analysis.isMate) {
            return analysis.score > 0 ? 100 : 0
        }
        const score = analysis.score
        // Sigmoid-like scaling for visual bar
        // 0 -> 50%
        // +5 -> ~90%
        // -5 -> ~10%
        const clamped = Math.max(-10, Math.min(10, score))
        return 50 + (clamped / 20) * 100
        // 0 -> 50
        // -10 -> 0
        // +10 -> 100
        // Wait, 50 + (-10/20)*100 = 0. Correct.
    }

    return (
        <div className="analysis-panel">
            <div className="analysis-header">
                <h3>Engine Evaluation</h3>
                <span className="analysis-depth">Depth: {analysis?.depth || 0}</span>
            </div>

            <div className="eval-bar-container">
                <div
                    className="eval-bar-fill"
                    style={{ height: `${getEvalPercent()}%` }}
                />
                <div className="eval-score">{getEvalText()}</div>
            </div>

            <div className="analysis-lines">
                <div className="best-line">
                    <span className="label">Best Line:</span>
                    <div className="moves">
                        {analysis?.pv.map((move, i) => (
                            <span key={i} className="move">{move}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnalysisPanel
