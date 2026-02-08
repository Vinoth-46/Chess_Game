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

    // Fallback unicode symbols if images fail
    const pieceSymbols: Record<string, string> = {
        'white-queen': '♕',
        'white-rook': '♖',
        'white-bishop': '♗',
        'white-knight': '♘',
        'black-queen': '♛',
        'black-rook': '♜',
        'black-bishop': '♝',
        'black-knight': '♞',
    }

    const colorName = color === 'w' ? 'white' : 'black'
    const pieceNames: Record<PieceSymbol, string> = {
        q: 'queen',
        r: 'rook',
        b: 'bishop',
        n: 'knight',
        p: 'pawn', // Won't be used
        k: 'king'  // Won't be used
    }

    return (
        <div className="promotion-modal-overlay" onClick={onClose}>
            <div className="promotion-modal" onClick={e => e.stopPropagation()}>
                <h3 className="promotion-title">Promote Pawn</h3>
                <div className="promotion-options">
                    {pieces.map(type => (
                        <div
                            key={type}
                            className="promotion-option"
                            onClick={() => onSelect(type)}
                            title={`Promote to ${pieceNames[type]}`}
                        >
                            <div className={`promotion-piece ${colorName} ${pieceNames[type]}`}>
                                <span className="piece-symbol">
                                    {pieceSymbols[`${colorName}-${pieceNames[type]}`]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PromotionModal
