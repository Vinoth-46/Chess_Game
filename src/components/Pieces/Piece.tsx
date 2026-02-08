import React, { useRef } from 'react'
import { useDrag } from 'react-dnd'
import type { Square, PieceSymbol, Color } from '../../types/chess'
import { PIECE_NAMES } from '../../types/chess'
import './Piece.css'

interface PieceProps {
    type: PieceSymbol
    color: Color
    square: Square
    isSelected: boolean
    canInteract?: boolean
}

const Piece: React.FC<PieceProps> = ({ type, color, square, isSelected, canInteract = true }) => {
    const ref = useRef<HTMLDivElement>(null)

    // Set up drag source
    const [{ isDragging }, drag] = useDrag({
        type: 'piece',
        item: { square, pieceType: type, pieceColor: color },
        canDrag: canInteract,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    // Connect drag ref
    drag(ref)

    const pieceName = PIECE_NAMES[type]
    const colorName = color === 'w' ? 'white' : 'black'

    // Use Unicode chess symbols as fallback
    const pieceSymbols: Record<string, string> = {
        'white-king': '♔',
        'white-queen': '♕',
        'white-rook': '♖',
        'white-bishop': '♗',
        'white-knight': '♘',
        'white-pawn': '♙',
        'black-king': '♚',
        'black-queen': '♛',
        'black-rook': '♜',
        'black-bishop': '♝',
        'black-knight': '♞',
        'black-pawn': '♟',
    }

    return (
        <div
            ref={ref}
            className={`piece ${colorName} ${pieceName} ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
            data-piece={`${colorName}-${pieceName}`}
        >
            <span className="piece-symbol">
                {pieceSymbols[`${colorName}-${pieceName}`]}
            </span>
        </div>
    )
}

export default React.memo(Piece)
