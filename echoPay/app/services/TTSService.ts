import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from "expo-audio"
import { PRERECORDED_AUDIO, PrerecordedAudioKey } from "../config/audioConfig"
import * as FileSystem from "expo-file-system"

/* ---------- TTS Configuration ---------- */

const TTS_CONFIG = {
    apiKey: process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY,
    voiceId: process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID,
    apiUrl:
        process.env.EXPO_PUBLIC_ELEVENLABS_API_URL ||
        "https://api.elevenlabs.io/v1/text-to-speech",
    voiceSettings: {
        stability: 1.0,
        similarity_boost: 1.0,
        style: 0.0,
        use_speaker_boost: false,
    },
}

class TTSService {
    /* ---------- Static Instance ---------- */
    private static instance: TTSService

    /* ---------- Private State ---------- */
    private currentPlayer: AudioPlayer | null = null
    private isPlaying = false
    private audioConfigured = false

    static getInstance(): TTSService {
        if (!TTSService.instance) {
            TTSService.instance = new TTSService()
        }
        return TTSService.instance
    }

    constructor() {
        this.configureAudioSession()
    }

    /* ---------- Audio Session Configuration ---------- */

    private async configureAudioSession(): Promise<void> {
        try {
            await setAudioModeAsync({
                allowsRecording: false,
                playsInSilentMode: true,
            })
            this.audioConfigured = true
        } catch (error) {
            console.error("❌ Audio session configuration failed:", error)
        }
    }

    /* ---------- Public Speech Methods ---------- */

    async speak(text: string, isPrerecorded: boolean = false): Promise<void> {
        try {
            console.log(
                `🎤 TTS ${isPrerecorded ? "Pre-recorded" : "AI"} - Starting:`,
                text,
            )

            // Stop any current audio
            await this.stop()

            // Ensure audio session is configured
            if (!this.audioConfigured) {
                await this.configureAudioSession()
            }

            if (isPrerecorded) {
                await this.playAudio(text as PrerecordedAudioKey, true)
            } else {
                const audioUri = await this.generateSpeech(text)
                if (audioUri) {
                    await this.playAudio(audioUri, false)
                }
            }
        } catch (error) {
            console.error("❌ TTS Error:", error)
        }
    }

    async stop(): Promise<void> {
        if (this.currentPlayer) {
            try {
                await this.currentPlayer.pause()
                this.currentPlayer.remove()
                this.currentPlayer = null
                this.isPlaying = false
                console.log("⏹️ Audio stopped")
            } catch (error) {
                console.error("❌ Stop audio error:", error)
            }
        }
    }

    /* ---------- Private Audio Methods ---------- */

    private async playAudio(
        source: string | PrerecordedAudioKey,
        isPrerecorded: boolean,
    ): Promise<void> {
        try {
            let audioSource: any

            if (isPrerecorded) {
                const audioConfig =
                    PRERECORDED_AUDIO[source as PrerecordedAudioKey]
                if (!audioConfig) {
                    console.error("❌ Audio not found for key:", source)
                    return
                }
                audioSource = audioConfig.audioFile
            } else {
                audioSource = source as string
            }

            // Create audio player
            this.currentPlayer = createAudioPlayer(audioSource)
            this.isPlaying = true

            // Configure player settings
            this.currentPlayer.volume = 1.0
            this.currentPlayer.shouldCorrectPitch = false

            // Minimal event listener - only for completion
            this.currentPlayer.addListener("playbackStatusUpdate", (status) => {
                if (status.isLoaded && status.didJustFinish) {
                    this.handlePlaybackFinished(source as string, isPrerecorded)
                }
            })

            // Start playback
            await this.currentPlayer.play()
            console.log(`▶️ Audio started`)
        } catch (error) {
            console.error("❌ Audio playback error:", error)
            this.isPlaying = false
            this.currentPlayer = null
        }
    }

    private async handlePlaybackFinished(
        source: string,
        isPrerecorded: boolean,
    ): Promise<void> {
        console.log("✅ Audio finished")
        this.isPlaying = false

        // Remove the player
        if (this.currentPlayer) {
            try {
                this.currentPlayer.remove()
            } catch (error) {
                console.error("❌ Error removing player:", error)
            }
            this.currentPlayer = null
        }

        // Clean up generated audio files
        if (!isPrerecorded && source.startsWith("file://")) {
            this.cleanupGeneratedFile(source)
        }
    }

    private async cleanupGeneratedFile(uri: string): Promise<void> {
        try {
            await FileSystem.deleteAsync(uri, { idempotent: true })
        } catch (error) {
            console.error("❌ Error cleaning up generated file:", error)
        }
    }

    /* ---------- Speech Generation ---------- */

    private async generateSpeech(text: string): Promise<string | null> {
        // Validate configuration
        if (!TTS_CONFIG.apiKey || !TTS_CONFIG.voiceId) {
            console.error("❌ Missing ElevenLabs configuration")
            return null
        }

        const requestUrl = `${TTS_CONFIG.apiUrl}/${TTS_CONFIG.voiceId}?output_format=mp3_44100_128`
        const requestBody = {
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: TTS_CONFIG.voiceSettings,
        }

        try {
            const response = await fetch(requestUrl, {
                method: "POST",
                headers: {
                    "xi-api-key": TTS_CONFIG.apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error(
                    "❌ ElevenLabs API Error:",
                    response.status,
                    errorText,
                )
                return null
            }

            // Process audio response
            const audioArrayBuffer = await response.arrayBuffer()
            const uint8Array = new Uint8Array(audioArrayBuffer)

            // Convert to base64 without stack overflow (handle large arrays)
            let binaryString = ""
            for (let i = 0; i < uint8Array.length; i++) {
                binaryString += String.fromCharCode(uint8Array[i])
            }
            const base64 = btoa(binaryString)

            // Save to temporary file
            const timestamp = Date.now()
            const tempUri = `${FileSystem.cacheDirectory}tts_${timestamp}.mp3`

            await FileSystem.writeAsStringAsync(tempUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            })

            console.log("✅ AI audio generated")
            return tempUri
        } catch (error) {
            console.error("❌ Speech generation failed:", error)
            return null
        }
    }

    /* ---------- Public State Methods ---------- */

    getIsPlaying(): boolean {
        return this.isPlaying
    }

    /* ---------- Configuration Helpers ---------- */

    static isConfigured(): boolean {
        return !!(TTS_CONFIG.apiKey && TTS_CONFIG.voiceId)
    }

    static getConfigStatus(): string {
        if (!TTS_CONFIG.apiKey) return "Missing API key"
        if (!TTS_CONFIG.voiceId) return "Missing voice ID"
        return "Configured"
    }

    getAudioSessionStatus(): {
        configured: boolean
        mode: string
        config: typeof TTS_CONFIG
    } {
        return {
            configured: this.audioConfigured,
            mode: this.audioConfigured
                ? "High Quality (expo-audio)"
                : "Default",
            config: TTS_CONFIG,
        }
    }
}

/* ---------- Exports ---------- */

export const TTSServiceClass = TTSService
export default TTSService.getInstance()
