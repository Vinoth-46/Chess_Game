import React from 'react'
import { FILES, RANKS } from '../../types/chess'
import type { BoardTheme } from '../../types/chess'
import './Board.css'

interface CoordinatesProps {
    isFlipped: boolean
    theme: BoardTheme
}

const Coordinates: React.FC<CoordinatesProps> = ({ isFlipped, theme }) => {
    const files = isFlipped ? [...FILES].reverse() : FILES
    const ranks = isFlipped ? RANKS : [...RANKS].reverse()

    return (
        <>
            {/* Rank coordinates (1-8 on left side) */}
            <div className="coordinates ranks">
                {ranks.map((rank, index) => (
                    <span
                        key={rank}
                        className="coordinate"
                        style={{
                            color: index % 2 === 0 ? theme.lightSquare : theme.darkSquare
                        }}
                    >
                        {rank}
                    </span>
                ))}
            </div>

            {/* File coordinates (a-h on bottom) */}
            <div className="coordinates files">
                {files.map((file, index) => (
                    <span
                        key={file}
                        className="coordinate"
                        style={{
                            color: index % 2 === 1 ? theme.lightSquare : theme.darkSquare
                        }}
                    >
                        {file}
                    </span>
                ))}
            </div>
        </>
    )
}

export default React.memo(Coordinates)
