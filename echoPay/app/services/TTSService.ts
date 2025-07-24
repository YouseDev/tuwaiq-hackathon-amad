import { createAudioPlayer, AudioPlayer } from "expo-audio"
import { PRERECORDED_AUDIO, PrerecordedAudioKey } from "../config/audioConfig"
import * as FileSystem from "expo-file-system"

// Environment variables for TTS configuration
const TTS_CONFIG = {
    apiKey: process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY,
    voiceId: process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID,
    apiUrl:
        process.env.EXPO_PUBLIC_ELEVENLABS_API_URL ||
        "https://api.elevenlabs.io/v1/text-to-speech",
    voiceSettings: {
        stability: parseFloat(process.env.EXPO_PUBLIC_TTS_STABILITY || "1.0"),
        similarity_boost: parseFloat(
            process.env.EXPO_PUBLIC_TTS_SIMILARITY_BOOST || "1.0",
        ),
        style: parseFloat(process.env.EXPO_PUBLIC_TTS_STYLE || "0.0"),
        use_speaker_boost: process.env.EXPO_PUBLIC_TTS_SPEAKER_BOOST === "true",
    },
}

class TTSService {
    private static instance: TTSService
    private currentPlayer: AudioPlayer | null = null
    private isPlaying = false

    static getInstance(): TTSService {
        if (!TTSService.instance) {
            TTSService.instance = new TTSService()
        }
        return TTSService.instance
    }

    async speak(text: string, isPrerecorded: boolean = false): Promise<void> {
        try {
            console.log("🎤 TTS Service - speak() called:", {
                text,
                isPrerecorded,
            })

            // Stop any current audio
            await this.stop()

            if (isPrerecorded) {
                console.log("📼 Playing pre-recorded audio")
                await this.playPrerecorded(text as PrerecordedAudioKey)
            } else {
                console.log("🤖 Generating AI speech")
                await this.generateAndPlay(text)
            }
        } catch (error) {
            console.error("❌ TTS Error:", error)
        }
    }

    private async playPrerecorded(key: PrerecordedAudioKey): Promise<void> {
        console.log("📼 playPrerecorded() called with key:", key)

        const audioConfig = PRERECORDED_AUDIO[key]
        if (!audioConfig) {
            console.error("❌ Audio not found for key:", key)
            return
        }

        console.log("📼 Audio config found:", audioConfig)

        try {
            this.currentPlayer = createAudioPlayer(audioConfig.audioFile)
            this.isPlaying = true
            console.log("✅ Pre-recorded player created successfully")

            this.currentPlayer.addListener("playbackStatusUpdate", (status) => {
                console.log("📼 Pre-recorded status update:", status)
                if (status.didJustFinish) {
                    console.log("✅ Pre-recorded audio finished")
                    this.isPlaying = false
                    this.currentPlayer = null
                }
            })

            this.currentPlayer.play()
            console.log("▶️ Pre-recorded audio play() called")
        } catch (error) {
            console.error("❌ Pre-recorded audio error:", error)
            this.isPlaying = false
            this.currentPlayer = null
        }
    }

    private async generateAndPlay(text: string): Promise<void> {
        console.log("🤖 generateAndPlay() called with text:", text)

        // ElevenLabs API call for dynamic Arabic speech
        const audioFileUri = await this.generateSpeech(text)
        console.log("🤖 generateSpeech() returned:", audioFileUri)

        if (audioFileUri) {
            try {
                console.log(
                    "🤖 Attempting to create audio player with file:",
                    audioFileUri,
                )

                this.currentPlayer = createAudioPlayer(audioFileUri)
                this.isPlaying = true
                console.log("✅ Generated audio player created successfully")

                this.currentPlayer.addListener(
                    "playbackStatusUpdate",
                    (status) => {
                        console.log("🤖 Generated audio status update:", status)
                        if (status.didJustFinish) {
                            console.log("✅ Generated audio finished")
                            this.isPlaying = false
                            this.currentPlayer = null
                            // Clean up temporary file
                            this.cleanupTempFile(audioFileUri)
                        }
                    },
                )

                this.currentPlayer.play()
                console.log("▶️ Generated audio play() called")
            } catch (error) {
                console.error("❌ Generated audio player error:", error)
                this.isPlaying = false
                this.currentPlayer = null
                // Clean up temporary file on error
                this.cleanupTempFile(audioFileUri)
            }
        } else {
            console.error("❌ No audio result from generateSpeech")
        }
    }

    private async cleanupTempFile(uri: string): Promise<void> {
        try {
            if (uri.startsWith("file://")) {
                console.log("🗑️ Cleaning up temp file:", uri)
                await FileSystem.deleteAsync(uri, { idempotent: true })
                console.log("✅ Temp file cleaned up")
            }
        } catch (error) {
            console.error("❌ Error cleaning up temp file:", error)
        }
    }

    private async generateSpeech(text: string): Promise<string | null> {
        console.log("🌐 generateSpeech() starting with text:", text)

        // Validate required environment variables
        if (!TTS_CONFIG.apiKey || !TTS_CONFIG.voiceId) {
            console.error(
                "❌ Missing ElevenLabs configuration. Check your .env file.",
            )
            console.error(
                "❌ Required: EXPO_PUBLIC_ELEVENLABS_API_KEY, EXPO_PUBLIC_ELEVENLABS_VOICE_ID",
            )
            console.log("🔍 Current config:", {
                hasApiKey: !!TTS_CONFIG.apiKey,
                apiKeyLength: TTS_CONFIG.apiKey?.length,
                hasVoiceId: !!TTS_CONFIG.voiceId,
                voiceId: TTS_CONFIG.voiceId,
            })
            return null
        }

        const requestUrl = `${TTS_CONFIG.apiUrl}/${TTS_CONFIG.voiceId}?output_format=mp3_44100_128`
        const requestBody = {
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: TTS_CONFIG.voiceSettings,
        }

        console.log("🌐 API Request details:")
        console.log("  URL:", requestUrl)
        console.log("  Headers:", {
            "xi-api-key": TTS_CONFIG.apiKey?.substring(0, 10) + "...",
            "Content-Type": "application/json",
        })
        console.log("  Body:", requestBody)

        try {
            const response = await fetch(requestUrl, {
                method: "POST",
                headers: {
                    "xi-api-key": TTS_CONFIG.apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            })

            console.log("🌐 Response received:")
            console.log("  Status:", response.status)
            console.log("  StatusText:", response.statusText)
            console.log(
                "  Headers:",
                Object.fromEntries(response.headers.entries()),
            )

            if (response.ok) {
                console.log("✅ Response is OK, processing audio data...")

                // Get actual audio data from response body
                const audioArrayBuffer = await response.arrayBuffer()
                console.log("📄 Audio data received:")
                console.log("  Size:", audioArrayBuffer.byteLength, "bytes")

                // Convert to base64 for file system
                const uint8Array = new Uint8Array(audioArrayBuffer)
                const base64 = btoa(String.fromCharCode(...uint8Array))
                console.log("🔄 Converted to base64, length:", base64.length)

                // Save to temporary file
                const timestamp = Date.now()
                const tempUri = `${FileSystem.cacheDirectory}tts_${timestamp}.mp3`
                console.log("💾 Saving to temp file:", tempUri)

                await FileSystem.writeAsStringAsync(tempUri, base64, {
                    encoding: FileSystem.EncodingType.Base64,
                })

                console.log("✅ Audio file saved successfully")

                // Verify file exists
                const fileInfo = await FileSystem.getInfoAsync(tempUri)
                console.log("📁 File info:", fileInfo)

                return tempUri
            } else {
                const errorText = await response.text()
                console.error("❌ ElevenLabs API Error:")
                console.error("  Status:", response.status)
                console.error("  Error text:", errorText)
                return null
            }
        } catch (error) {
            console.error("❌ ElevenLabs API Network Error:", error)
            return null
        }
    }

    async stop(): Promise<void> {
        console.log("⏹️ stop() called")
        if (this.currentPlayer) {
            try {
                this.currentPlayer.pause()
                this.currentPlayer.remove()
                this.currentPlayer = null
                this.isPlaying = false
                console.log("✅ Audio stopped successfully")
            } catch (error) {
                console.error("❌ Stop audio error:", error)
            }
        } else {
            console.log("ℹ️ No player to stop")
        }
    }

    getIsPlaying(): boolean {
        return this.isPlaying
    }

    // Helper method to check if TTS is properly configured
    static isConfigured(): boolean {
        const configured = !!(TTS_CONFIG.apiKey && TTS_CONFIG.voiceId)
        return configured
    }

    // Helper method to get current configuration status
    static getConfigStatus(): string {
        if (!TTS_CONFIG.apiKey) return "Missing API key"
        if (!TTS_CONFIG.voiceId) return "Missing voice ID"
        return "Configured"
    }
}

// Export both the instance and the class
export const TTSServiceClass = TTSService
export default TTSService.getInstance()
