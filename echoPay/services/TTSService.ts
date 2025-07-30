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
            const startTime = Date.now()
            console.log("🗣️ TTS start:", text)
            await this.stop()

            if (!this.audioConfigured) await this.configureAudioSession()

            const audioUri = await this.generateSpeech(text)
            if (audioUri) {
                await this.playAudio(audioUri)
                const endTime = Date.now()
                console.log(`⚡ TTS took ${endTime - startTime}ms`)
            }
        } catch (err) {
            console.error("❌ TTS error:", err)
        }
    }

    /* ---------- Public: Stop ---------- */
    async stop() {
        if (!this.currentPlayer) return
        try {
            this.currentPlayer.pause()
            this.currentPlayer.remove()
        } catch (err) {
            console.error("❌ Stop error:", err)
        } finally {
            this.currentPlayer = null
            this.isPlaying = false
        }
    }

    /* ---------- Playback ---------- */
    private async playAudio(uri: string) {
        try {
            // Ensure audio session is configured before playing
            if (!this.audioConfigured) {
                await this.configureAudioSession()
                // Wait a bit for audio session to stabilize
                await new Promise((resolve) => setTimeout(resolve, 100))
            }

            console.log("🎵 Creating audio player for:", uri)
            this.currentPlayer = createAudioPlayer(uri)
            this.currentPlayer.volume = 1.0
            this.isPlaying = true

            await this.currentPlayer.play()
            console.log("▶️ Audio playing")
        } catch (err) {
            console.error("❌ Playback error:", err)
            this.isPlaying = false
            this.currentPlayer = null
        }
    }

    private async onPlaybackFinished(uri: string) {
        console.log("✅ Playback finished")
        this.isPlaying = false

        if (this.currentPlayer) {
            this.currentPlayer.remove()
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
        if (!TTS_CONFIG.apiKey || !TTS_CONFIG.voiceId) {
            console.error("❌ Missing ElevenLabs API key or voice ID")
            return null
        }

        const url = `${TTS_CONFIG.apiUrl}/${TTS_CONFIG.voiceId}?output_format=mp3_44100_128`
        const body = {
            text,
            model_id: "eleven_flash_v2_5",
            voice_settings: TTS_CONFIG.voiceSettings,
        }

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "xi-api-key": TTS_CONFIG.apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })

            if (!res.ok) {
                console.error(
                    "❌ ElevenLabs error:",
                    res.status,
                    await res.text(),
                )
                return null
            }

            /* ---- convert ArrayBuffer → base64 (without Buffer) ---- */
            const arrayBuf = await res.arrayBuffer()
            const uint8Arr = new Uint8Array(arrayBuf)
            let binary = ""
            for (let i = 0; i < uint8Arr.length; i++) {
                binary += String.fromCharCode(uint8Arr[i])
            }
            const base64 = btoa(binary)

            /* ---- write to a temp .mp3 ---- */
            const uri = `${FileSystem.cacheDirectory}tts_${Date.now()}.mp3`
            await FileSystem.writeAsStringAsync(uri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            })

            console.log("✅ TTS generated")
            return uri
        } catch (err) {
            console.error("❌ Generate speech failed:", err)
            return null
        }
    }

    /* ---------- Getters ---------- */
    getIsPlaying() {
        return this.isPlaying
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
