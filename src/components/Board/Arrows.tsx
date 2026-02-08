import React from 'react'
import type { Arrow, Square } from '../../types/chess'
import { squareToCoords } from '../../types/chess'
import './Board.css'

interface ArrowsProps {
    arrows: Arrow[]
    isFlipped: boolean
}

const Arrows: React.FC<ArrowsProps> = ({ arrows, isFlipped }) => {
    if (arrows.length === 0) return null

    return (
        <svg className="arrows-layer" viewBox="0 0 800 800">
            <defs>
                <marker
                    id="arrowhead-green"
                    markerWidth="4"
                    markerHeight="4"
                    refX="2.5"
                    refY="2"
                    orient="auto"
                >
                    <polygon points="0 0, 4 2, 0 4" fill="rgba(0, 128, 0, 0.8)" />
                </marker>
                <marker
                    id="arrowhead-red"
                    markerWidth="4"
                    markerHeight="4"
                    refX="2.5"
                    refY="2"
                    orient="auto"
                >
                    <polygon points="0 0, 4 2, 0 4" fill="rgba(200, 0, 0, 0.8)" />
                </marker>
                <marker
                    id="arrowhead-blue"
                    markerWidth="4"
                    markerHeight="4"
                    refX="2.5"
                    refY="2"
                    orient="auto"
                >
                    <polygon points="0 0, 4 2, 0 4" fill="rgba(0, 100, 200, 0.8)" />
                </marker>
                <marker
                    id="arrowhead-yellow"
                    markerWidth="4"
                    markerHeight="4"
                    refX="2.5"
                    refY="2"
                    orient="auto"
                >
                    <polygon points="0 0, 4 2, 0 4" fill="rgba(200, 180, 0, 0.8)" />
                </marker>
            </defs>

            {arrows.map((arrow, index) => {
                const from = squareToCoords(arrow.from)
                const to = squareToCoords(arrow.to)

                // Calculate positions (centered on squares)
                let x1 = (from.file * 100) + 50
                let y1 = (7 - from.rank) * 100 + 50
                let x2 = (to.file * 100) + 50
                let y2 = (7 - to.rank) * 100 + 50

                if (isFlipped) {
                    x1 = 800 - x1
                    y1 = 800 - y1
                    x2 = 800 - x2
                    y2 = 800 - y2
                }

                // Shorten the line slightly so arrow doesn't overlap piece
                const dx = x2 - x1
                const dy = y2 - y1
                const length = Math.sqrt(dx * dx + dy * dy)
                const shortenBy = 25
                x2 = x2 - (dx / length) * shortenBy
                y2 = y2 - (dy / length) * shortenBy

                const markerColor = arrow.color.includes('green') ? 'green'
                    : arrow.color.includes('red') ? 'red'
                        : arrow.color.includes('blue') ? 'blue'
                            : 'yellow'

                return (
                    <line
                        key={`${arrow.from}-${arrow.to}-${index}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={arrow.color}
                        strokeWidth="14"
                        strokeLinecap="round"
                        markerEnd={`url(#arrowhead-${markerColor})`}
                        opacity="0.8"
                    />
                )
            })}
        </svg>
    )
}

export default React.memo(Arrows)
