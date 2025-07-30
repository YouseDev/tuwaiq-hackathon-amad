import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface VoiceContextType {
    // Two simple states
    isButtonHeld: boolean
    isSTTProcessing: boolean
    finalText: string
    
    // State setters
    setIsButtonHeld: (held: boolean) => void
    setIsSTTProcessing: (processing: boolean, callback?: () => void) => void
    setFinalText: (text: string | ((prev: string) => string)) => void
    
    // Processing trigger
    checkAndProcess: () => void
    
    // Command processor (set by assistant.tsx)
    onProcessCommand: ((command: string) => void) | null
    setOnProcessCommand: (handler: (command: string) => void) => void
    
    // Reset function
    resetVoiceSession: () => void
}

const VoiceContext = createContext<VoiceContextType | null>(null)

export const VoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Two simple states
    const [isButtonHeld, setIsButtonHeld] = useState(false)
    const [isSTTProcessing, setIsSTTProcessing] = useState(false)
    const [finalText, setFinalText] = useState("")
    
    // Command processor handler
    const [onProcessCommand, setOnProcessCommand] = useState<((command: string) => void) | null>(null)
    
    // Enhanced state setters with logging
    const setIsButtonHeldWithLog = useCallback((held: boolean) => {
        console.log(`🎙️ Button ${held ? 'PRESSED' : 'RELEASED'} (${Date.now()})`)
        setIsButtonHeld(held)
    }, [])
    
    const setIsSTTProcessingWithLog = useCallback((processing: boolean, callback?: () => void) => {
        console.log(`🔄 STT Processing = ${processing ? 'TRUE' : 'FALSE'} (${Date.now()})`)
        setIsSTTProcessing(processing)
        
        // Call callback after state update if provided
        if (callback) {
            setTimeout(callback, 0) // Next tick
        }
    }, [])
    
    const setFinalTextWithLog = useCallback((text: string | ((prev: string) => string)) => {
        if (typeof text === 'function') {
            setFinalText(prev => {
                const newText = text(prev)
                console.log(`🎯 Final Text Updated: "${newText.slice(0, 30)}${newText.length > 30 ? '...' : ''}" (${Date.now()})`)
                return newText
            })
        } else {
            console.log(`🎯 Final Text Set: "${text.slice(0, 30)}${text.length > 30 ? '...' : ''}" (${Date.now()})`)
            setFinalText(text)
        }
    }, [])
    
    // Simple processing function - the heart of the system
    const checkAndProcess = useCallback(() => {
        const timestamp = Date.now()
        console.log(`🔍 CheckAndProcess called (${timestamp}):`, {
            isButtonHeld,
            isSTTProcessing,
            hasText: !!finalText.trim(),
            textLength: finalText.length,
            textPreview: finalText.slice(0, 20)
        })
        
        if (!isButtonHeld && !isSTTProcessing && finalText.trim()) {
            console.log(`✅ PROCESSING COMMAND: "${finalText}" (${timestamp})`)
            if (onProcessCommand) {
                onProcessCommand(finalText)
                // Clear finalText after processing to prevent stale commands
                setFinalText("")
            } else {
                console.warn("⚠️ No command processor set!")
            }
        } else {
            console.log(`❌ Not processing (${timestamp}):`, {
                buttonHeld: isButtonHeld,
                sttProcessing: isSTTProcessing,
                hasText: !!finalText.trim(),
                reason: !finalText.trim() ? 'no text' : isButtonHeld ? 'button held' : 'stt processing'
            })
        }
    }, [isButtonHeld, isSTTProcessing, finalText, onProcessCommand])
    
    // Reset session
    const resetVoiceSession = useCallback(() => {
        console.log("🔄 Voice session reset")
        setIsButtonHeld(false)
        setIsSTTProcessing(false)  
        setFinalText("")
    }, [])
    
    const value: VoiceContextType = {
        // States
        isButtonHeld,
        isSTTProcessing,
        finalText,
        
        // Setters with logging
        setIsButtonHeld: setIsButtonHeldWithLog,
        setIsSTTProcessing: setIsSTTProcessingWithLog,
        setFinalText: setFinalTextWithLog,
        
        // Processing
        checkAndProcess,
        onProcessCommand,
        setOnProcessCommand: (handler) => setOnProcessCommand(() => handler),
        
        // Reset
        resetVoiceSession,
    }
    
    return (
        <VoiceContext.Provider value={value}>
            {children}
        </VoiceContext.Provider>
    )
}

export const useVoice = (): VoiceContextType => {
    const context = useContext(VoiceContext)
    if (!context) {
        throw new Error('useVoice must be used within a VoiceProvider')
    }
    return context
}