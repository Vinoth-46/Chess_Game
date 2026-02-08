import { useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'
import { useSettingsStore } from '../store/settingsStore'

// Sound effect types
type SoundType = 'move' | 'capture' | 'check' | 'castle' | 'promote' | 'gameEnd' | 'lowTime' | 'click'

// Sound URLs (using data URIs for embedded sounds)
// These are placeholder sounds - in production, use actual audio files
const SOUND_URLS: Record<SoundType, string> = {
    move: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAB/',
    capture: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAB/',
    check: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAB/',
    castle: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAB/',
    promote: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAB/',
    gameEnd: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAB/',
    lowTime: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAB/',
    click: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAB/',
}

/**
 * Hook for playing chess sound effects
 */
export function useAudio() {
    const { soundEnabled, soundVolume } = useSettingsStore()
    const soundsRef = useRef<Map<SoundType, Howl>>(new Map())
    const loadedRef = useRef(false)

    // Initialize sounds
    useEffect(() => {
        if (loadedRef.current) return

        Object.entries(SOUND_URLS).forEach(([type, url]) => {
            const sound = new Howl({
                src: [url],
                volume: soundVolume,
                preload: true,
            })
            soundsRef.current.set(type as SoundType, sound)
        })

        loadedRef.current = true

        return () => {
            soundsRef.current.forEach(sound => sound.unload())
            soundsRef.current.clear()
            loadedRef.current = false
        }
    }, [])

    // Update volume when changed
    useEffect(() => {
        soundsRef.current.forEach(sound => {
            sound.volume(soundVolume)
        })
    }, [soundVolume])

    const playSound = useCallback((type: SoundType) => {
        if (!soundEnabled) return

        const sound = soundsRef.current.get(type)
        if (sound) {
            sound.play()
        }
    }, [soundEnabled])

    const playMoveSound = useCallback((isCapture: boolean, isCheck: boolean, isCastle: boolean, isPromotion: boolean) => {
        if (!soundEnabled) return

        if (isCheck) {
            playSound('check')
        } else if (isCapture) {
            playSound('capture')
        } else if (isCastle) {
            playSound('castle')
        } else if (isPromotion) {
            playSound('promote')
        } else {
            playSound('move')
        }
    }, [soundEnabled, playSound])

    // Haptic feedback for mobile
    const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
        if ('vibrate' in navigator) {
            const patterns = {
                light: [10],
                medium: [25],
                heavy: [50],
            }
            navigator.vibrate(patterns[type])
        }
    }, [])

    return {
        playSound,
        playMoveSound,
        triggerHaptic,
    }
}
