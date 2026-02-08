import React, { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import type { Player } from '../../types/chess'
import './GameControls.css'

interface TimerProps {
    time: number
    isActive: boolean
    player: Player
}

const Timer: React.FC<TimerProps> = ({ time, isActive, player }) => {
    const { updateTimer } = useGameStore()
    const intervalRef = useRef<number | null>(null)

    // Format time as MM:SS or M:SS.s for under 10 seconds
    const formatTime = (ms: number): string => {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000))
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60

        if (totalSeconds < 10 && ms > 0) {
            // Show tenths of seconds when under 10 seconds
            const tenths = Math.floor((ms % 1000) / 100)
            return `${seconds}.${tenths}`
        }

        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        if (isActive && time > 0) {
            intervalRef.current = window.setInterval(() => {
                updateTimer(player, time - 100)
            }, 100)
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isActive, time, player, updateTimer])

    const isLowTime = time < 30000 // Under 30 seconds
    const isCriticalTime = time < 10000 // Under 10 seconds
    const isTimeOut = time <= 0

    return (
        <div
            className={`timer ${player} ${isActive ? 'active' : ''} ${isLowTime ? 'low' : ''} ${isCriticalTime ? 'critical' : ''} ${isTimeOut ? 'timeout' : ''}`}
        >
            <div className="timer-player">
                <span className="player-icon">{player === 'white' ? '○' : '●'}</span>
                <span className="player-name">{player === 'white' ? 'White' : 'Black'}</span>
            </div>
            <div className="timer-display">
                {formatTime(time)}
            </div>
        </div>
    )
}

export default React.memo(Timer)
