/// <reference types="vite/client" />

// CSS module declarations
declare module '*.css' {
    const content: { [className: string]: string }
    export default content
}

declare module '*.scss' {
    const content: { [className: string]: string }
    export default content
}

// Image imports
declare module '*.svg' {
    const content: string
    export default content
}

declare module '*.png' {
    const content: string
    export default content
}

declare module '*.jpg' {
    const content: string
    export default content
}

declare module '*.webp' {
    const content: string
    export default content
}

// Audio imports
declare module '*.mp3' {
    const content: string
    export default content
}

declare module '*.wav' {
    const content: string
    export default content
}
