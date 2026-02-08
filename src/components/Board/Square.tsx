import React, { useCallback } from 'react'
import { useDrop } from 'react-dnd'
import type { Square as SquareType, BoardTheme } from '../../types/chess'
import './Board.css'

interface SquareProps {
    square: SquareType
    isLight: boolean
    isSelected: boolean
    isLegalMove: boolean
    isLastMove: boolean
    isCheck: boolean
    hasPiece: boolean
    theme: BoardTheme
    onClick: () => void
    onDrop: (from: SquareType, to: SquareType) => boolean
    children?: React.ReactNode
}

const Square: React.FC<SquareProps> = ({
    square,
    isLight,
    isSelected,
    isLegalMove,
    isLastMove,
    isCheck,
    hasPiece,
    onClick,
    onDrop,
    children,
}) => {
    // Set up drop target
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'piece',
        drop: (item: { square: SquareType }) => {
            onDrop(item.square, square)
        },
        canDrop: () => true,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })

    // Determine CSS classes
    const classNames = [
        'square',
        isLight ? 'light' : 'dark',
        isSelected && 'selected',
        isLegalMove && 'legal-move',
        isLastMove && 'last-move',
        isCheck && 'check',
        isOver && canDrop && 'drop-target',
    ].filter(Boolean).join(' ')

    return (
        <div
            ref={drop}
            className={classNames}
            onClick={onClick}
            data-square={square}
        >
            {children}
            {isLegalMove && !hasPiece && <div className="legal-move-dot" />}
            {isLegalMove && hasPiece && <div className="legal-capture-ring" />}
        </div>
    )
}

export default React.memo(Square)
