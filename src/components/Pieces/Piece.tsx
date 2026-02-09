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
    const colorCode = color === 'w' ? 'w' : 'b'
    const typeCode = type.toUpperCase()
    const pieceCode = type === 'n' ? `${colorCode}N` : `${colorCode}${typeCode}`

    // Construct basic file name wP, wN, wB, wR, wQ, wK etc.
    // For knight we use N to match standard notation, but my script used N for knight? 
    // Let's check the script: wP, wN, wB... Yes.

    // Actually the script uses: wP, wN, wB, wR, wQ, wK
    // type is lowercase 'p', 'n', 'b', 'r', 'q', 'k'
    // So for knight 'n' -> 'N'. For others 'p' -> 'P'.

    const svgName = `${color}${type === 'n' ? 'N' : type.toUpperCase()}`

    return (
        <div
            ref={ref}
            className={`piece ${colorName} ${pieceName} ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
            data-piece={`${colorName}-${pieceName}`}
        >
            <img
                src={`/assets/pieces/${svgName}.svg`}
                alt={`${colorName} ${pieceName}`}
                className="piece-image"
                draggable={false}
            />
        </div>
    )
}

export default React.memo(Piece)
