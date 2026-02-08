import React, { useState } from 'react'
import NewGameModal from './NewGameModal'
import './Modals.css'

interface GameModalsProps {
    showNewGame: boolean
    onCloseNewGame: () => void
}

const GameModals: React.FC<GameModalsProps> = ({
    showNewGame,
    onCloseNewGame,
}) => {
    return (
        <>
            {showNewGame && (
                <NewGameModal onClose={onCloseNewGame} />
            )}
        </>
    )
}

export default GameModals
