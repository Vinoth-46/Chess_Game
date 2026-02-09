import React from 'react'
import type { PieceSymbol, Color } from '../../types/chess'
import './PromotionModal.css'

interface PromotionModalProps {
    color: Color
    onSelect: (piece: PieceSymbol) => void
    onClose: () => void
}

const PromotionModal: React.FC<PromotionModalProps> = ({ color, onSelect, onClose }) => {
    const pieces: PieceSymbol[] = ['q', 'r', 'b', 'n']

    const colorName = color === 'w' ? 'white' : 'black'
    const pieceNames: Record<PieceSymbol, string> = {
        q: 'queen',
        r: 'rook',
        b: 'bishop',
        n: 'knight',
        p: 'pawn',
        k: 'king'
    }

    return (
        <div className="promotion-modal-overlay" onClick={onClose}>
            <div className="promotion-modal" onClick={e => e.stopPropagation()}>
                <h3 className="promotion-title">Promote Pawn</h3>
                <div className="promotion-options">
                    {pieces.map(type => {
                        const svgName = `${color}${type === 'n' ? 'N' : type.toUpperCase()}`
                        return (
                            <div
                                key={type}
                                className="promotion-option"
                                onClick={() => onSelect(type)}
                                title={`Promote to ${pieceNames[type]}`}
                            >
                                <div className={`promotion-piece piece ${colorName} ${pieceNames[type]}`}>
                                    <img
                                        src={`/assets/pieces/${svgName}.svg`}
                                        alt={`${colorName} ${pieceNames[type]}`}
                                        className="piece-image"
                                        draggable={false}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default PromotionModal
