import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from "expo-audio"
import * as FileSystem from "expo-file-system"

/* ---------- ElevenLabs TTS Config ---------- */
const TTS_CONFIG = {
    apiKey: process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY!,
    voiceId: process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID!,
    apiUrl:
        process.env.EXPO_PUBLIC_ELEVENLABS_API_URL ??
        "https://api.elevenlabs.io/v1/text-to-speech",
    voiceSettings: {
        stability: 1.0,
        similarity_boost: 1.0,
        style: 0.0,
        use_speaker_boost: false,
    },
}

class TTSService {
    /* ---------- Singleton ---------- */
    private static instance: TTSService
    static getInstance() {
        if (!TTSService.instance) TTSService.instance = new TTSService()
        return TTSService.instance
    }

    private currentPlayer: AudioPlayer | null = null
    private isPlaying = false
    private audioConfigured = false

    private constructor() {
        this.configureAudioSession()
    }

    /* ---------- Audio Session ---------- */
    private async configureAudioSession() {
        try {
            await setAudioModeAsync({
                allowsRecording: false,
                playsInSilentMode: true,
            })
            this.audioConfigured = true
            console.log("✅ Audio session configured")
        } catch (err) {
            console.error("❌ Audio session config failed:", err)
            this.audioConfigured = false
        }
    }

    /* ---------- Public: Speak ---------- */
    async speak(text: string) {
        try {
            // Input validation
            if (!text || typeof text !== "string" || text.trim().length === 0) {
                console.error("❌ Invalid text provided to TTS:", {
                    text,
                    type: typeof text,
                })
                return
            }

            const startTime = Date.now()
            console.log(
                "🗣️ TTS request:",
                text.substring(0, 100) + (text.length > 100 ? "..." : ""),
            )
            console.log("🎵 Audio state:", {
                isPlaying: this.isPlaying,
                hasCurrentPlayer: !!this.currentPlayer,
                audioConfigured: this.audioConfigured,
            })

            // Stop any existing audio immediately
            console.log("🛑 Stopping current audio before new TTS")
            await this.stop()

            if (!this.audioConfigured) {
                console.log("⚙️ Configuring audio session...")
                await this.configureAudioSession()
            }

            console.log("🎤 Generating speech...")
            const audioUri = await this.generateSpeech(text)
            if (audioUri) {
                console.log("▶️ Playing generated audio:", audioUri)
                await this.playAudio(audioUri)
                const endTime = Date.now()
                console.log(
                    `⚡ TTS completed successfully in ${endTime - startTime}ms`,
                )
            } else {
                console.error("❌ Failed to generate audio URI")
            }
        } catch (err) {
            console.error("❌ TTS critical error:", err)
            // Reset state on error
            this.isPlaying = false
            this.currentPlayer = null
        }
    }

    /* ---------- Public: Stop ---------- */
    async stop() {
        if (!this.currentPlayer) {
            console.log("🔇 No current player to stop")
            return
        }
        try {
            console.log("🛑 Stopping current audio player")

            if (this.isPlaying) {
                this.currentPlayer.pause()
                console.log("⏸️ Audio paused")
            }

            // Don't try to manually clean up - let audio system handle it
            this.currentPlayer = null
            this.isPlaying = false
            console.log("✅ Audio state reset")
        } catch (err) {
            console.error("❌ Stop error:", err)
            // Ensure state is reset even if pause fails
            this.currentPlayer = null
            this.isPlaying = false
        }
    }

    /* ---------- Playback ---------- */
    private async playAudio(uri: string) {
        try {
            // Ensure audio session is configured before playing
            if (!this.audioConfigured) {
                console.log(
                    "⚙️ Audio session not configured, configuring now...",
                )
                await this.configureAudioSession()
                // Wait a bit for audio session to stabilize
                await new Promise((resolve) => setTimeout(resolve, 100))
            }

            console.log("🎵 Creating audio player for:", uri)
            this.currentPlayer = createAudioPlayer(uri)

            if (!this.currentPlayer) {
                throw new Error("Failed to create audio player")
            }

            this.currentPlayer.volume = 1.0
            this.isPlaying = true

            // Add comprehensive event listeners
            this.currentPlayer.addListener("playbackStatusUpdate", (status) => {
                if (status.isLoaded && status.didJustFinish) {
                    console.log("✅ Audio playback finished naturally")
                    this.onPlaybackFinished(uri)
                }
            })

            console.log("▶️ Starting audio playback...")
            await this.currentPlayer.play()
            console.log("🎵 Audio is now playing")
        } catch (err) {
            console.error("❌ Playback critical error:", err)
            this.isPlaying = false
            this.currentPlayer = null
            throw err
        }
    }

    private async onPlaybackFinished(uri: string) {
        console.log("✅ Playback finished")
        this.isPlaying = false

        if (this.currentPlayer) {
            // Don't try to manually clean up - let audio system handle it
            this.currentPlayer = null
        }

        if (uri.startsWith("file://")) this.cleanupFile(uri)
    }

    private async cleanupFile(uri: string) {
        try {
            await FileSystem.deleteAsync(uri, { idempotent: true })
        } catch (err) {
            console.error("❌ Cleanup error:", err)
        }
    }

    /* ---------- ElevenLabs Request ---------- */
    private async generateSpeech(text: string): Promise<string | null> {
        console.log(
            "🎤 Starting speech generation for text:",
            text.substring(0, 50) + "...",
        )

        if (!TTS_CONFIG.apiKey || !TTS_CONFIG.voiceId) {
            console.error("❌ Missing ElevenLabs credentials:", {
                hasApiKey: !!TTS_CONFIG.apiKey,
                hasVoiceId: !!TTS_CONFIG.voiceId,
            })
            return null
        }

        const url = `${TTS_CONFIG.apiUrl}/${TTS_CONFIG.voiceId}?output_format=mp3_44100_128`
        const body = {
            text,
            model_id: "eleven_flash_v2_5",
            voice_settings: TTS_CONFIG.voiceSettings,
        }

        console.log("🌐 Making ElevenLabs API request to:", url)

        try {
            const startTime = Date.now()
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "xi-api-key": TTS_CONFIG.apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })

            const apiTime = Date.now() - startTime
            console.log(
                `🌐 API response received in ${apiTime}ms, status:`,
                res.status,
            )

            if (!res.ok) {
                const errorText = await res.text()
                console.error("❌ ElevenLabs API error:", {
                    status: res.status,
                    statusText: res.statusText,
                    error: errorText,
                })
                return null
            }

            console.log("📦 Converting audio data...")
            /* ---- convert ArrayBuffer → base64 (without Buffer) ---- */
            const arrayBuf = await res.arrayBuffer()
            console.log(
                "📦 Received audio data size:",
                arrayBuf.byteLength,
                "bytes",
            )

            const uint8Arr = new Uint8Array(arrayBuf)
            let binary = ""
            for (let i = 0; i < uint8Arr.length; i++) {
                binary += String.fromCharCode(uint8Arr[i])
            }
            const base64 = btoa(binary)

            /* ---- write to a temp .mp3 ---- */
            const uri = `${FileSystem.cacheDirectory}tts_${Date.now()}.mp3`
            console.log("💾 Writing audio file to:", uri)

            await FileSystem.writeAsStringAsync(uri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            })

            console.log(
                "✅ TTS generated successfully, file size:",
                base64.length,
                "chars",
            )
            return uri
        } catch (err) {
            console.error("❌ Generate speech critical error:", err)
            return null
        }
    }

    /* ---------- Public: Reset ---------- */
    async reset() {
        console.log("🔄 Resetting TTS service completely")
        await this.stop()
        this.audioConfigured = false
        console.log("♻️ TTS service reset complete")
    }

    /* ---------- Getters ---------- */
    getIsPlaying() {
        return this.isPlaying
    }

    getAudioState() {
        return {
            isPlaying: this.isPlaying,
            hasCurrentPlayer: !!this.currentPlayer,
            audioConfigured: this.audioConfigured,
        }
    }

    static isConfigured() {
        return !!(TTS_CONFIG.apiKey && TTS_CONFIG.voiceId)
    }

    static getConfigStatus() {
        if (!TTS_CONFIG.apiKey) return "Missing API key"
        if (!TTS_CONFIG.voiceId) return "Missing voice ID"
        return "Configured"
    }
}

/* ---------- Export Singleton ---------- */
export const TTSServiceClass = TTSService
export default TTSService.getInstance()
