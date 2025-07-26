import React, { useEffect, useRef, useState } from "react"
import {
    ScrollView,
    View,
    Text,
    Image,
    Pressable,
    ActivityIndicator,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { createAudioPlayer } from "expo-audio"
import { BankingContext, ChatMessage } from "./types/core"
import BalanceSection from "./components/BalanceSection"
import CreditCardSection from "./components/CreditCardSection"
import BillsSection from "./components/BillsSection"
import TransactionSection from "./components/TransactionSection"
import useSTTService from "./services/STTService"
import LLMService from "./services/LLMService"
import TTSService from "./services/TTSService" // ⬅️ NEW
import bankingData from "../assets/data/banking_data.json"

import tools from "./helpers/tools"

export default function App() {
    /* -------- Demo banking data -------- */
    const [userAccount] = useState(bankingData.accounts)
    const [userCards] = useState(bankingData.creditCards)
    const [userBills] = useState(bankingData.bills)
    const [userTransactions] = useState(bankingData.transactions.january_2024)

    const historyRef = useRef<ChatMessage[]>([
        {
            role: "system",
            content: tools.buildPrompt({
                ...bankingData,
                transactions: bankingData.transactions.january_2024,
            } as unknown as BankingContext),
        },
    ])

    /* -------- Command buffer for collecting all confident transcripts -------- */
    const [commandBuffer, setCommandBuffer] = useState<string[]>([])
    const processedCommandRef = useRef<string>("")

    /* -------- STT -------- */
    const {
        startListening,
        stopListening,
        isActive,
        transcript,
        isListening,
        confidence,
    } = useSTTService()

    /* -------- UI / busy -------- */
    const [busy, setBusy] = useState(false)
    const micDisabled = busy

    /* -------- Collect ALL transcripts for speed -------- */
    useEffect(() => {
        const clean = transcript.trim()

        // Add ALL transcripts (no confidence check for speed)
        if (clean && !busy) {
            // Skip if this transcript was already processed
            if (clean === processedCommandRef.current) {
                console.log(
                    "⏭️ Skipping already processed:",
                    clean.slice(0, 30) + "...",
                )
                return
            }

            setCommandBuffer((prev) => {
                // Only add if different from last entry
                if (prev.length === 0 || prev[prev.length - 1] !== clean) {
                    console.log(
                        "✅ Buffer:",
                        clean.slice(0, 40) + (clean.length > 40 ? "..." : ""),
                    )
                    return [...prev, clean]
                }
                return prev
            })
        }
    }, [transcript, busy])

    /* -------- Detect STT stop and process buffer -------- */
    const prevListening = useRef(isListening)
    useEffect(() => {
        if (prevListening.current && !isListening && commandBuffer.length > 0) {
            console.log(
                "🎯 STT stopped - buffer:",
                commandBuffer.length,
                "commands",
            )

            // Smart deduplication: remove repeated sequences and substrings
            const cleanBuffer = commandBuffer.filter((item, index) => {
                // Keep if it's not a substring of any other item
                return !commandBuffer.some(
                    (other, otherIndex) =>
                        otherIndex !== index &&
                        other.includes(item) &&
                        other.length > item.length,
                )
            })

            console.log(
                "🧹 Cleaned buffer:",
                cleanBuffer.length,
                "commands after deduplication",
            )

            // Use the longest (most complete) command from cleaned buffer
            const finalCommand = cleanBuffer.reduce((longest, current) =>
                current.length > longest.length ? current : longest,
            )

            console.log(
                "🎯 Selected command:",
                finalCommand.slice(0, 50) +
                    (finalCommand.length > 50 ? "..." : ""),
            )
            handleAfterSTTStop(finalCommand)
        }
        prevListening.current = isListening
    }, [isListening, commandBuffer])

    /* -------- Core flow -------- */
    const handleAfterSTTStop = async (finalCommand: string) => {
        setBusy(true)

        /* 1️⃣ Clear buffer and mark command as processed */
        setCommandBuffer([])
        processedCommandRef.current = finalCommand

        const query = finalCommand

        /* Add user message to history */
        historyRef.current.push({
            role: "user",
            content: query,
        })

        try {
            console.log(
                "🚀 Processing query:",
                query.slice(0, 50) + (query.length > 50 ? "..." : ""),
            )

            const llmRes = await LLMService.processUserQuery(historyRef.current)

            // Validate LLM response structure
            if (!llmRes || typeof llmRes !== "object") {
                throw new Error("Invalid LLM response structure")
            }

            if (!llmRes.response || typeof llmRes.response !== "string") {
                throw new Error("Missing or invalid response text")
            }

            /* 2️⃣ Play selected filler audio */
            if (llmRes.fillerAudio) {
                playFillerAudio(llmRes.fillerAudio)
            }

            /* 3️⃣ Push assistant reply */
            historyRef.current.push({
                role: "assistant",
                content: llmRes.response,
            })

            await TTSService.speak(llmRes.response)
        } catch (err) {
            console.error("❌ Complete error details:")
            console.error("❌ Error message:", (err as Error)?.message || err)
            console.error("❌ Error stack:", (err as Error)?.stack)
            console.error("❌ Query that caused error:", query)
            console.error(
                "❌ History at error:",
                JSON.stringify(historyRef.current, null, 2),
            )

            // Fallback TTS
            await TTSService.speak("عذراً، حدث خطأ في معالجة طلبك")
        }

        setBusy(false)

        // Clear processed command after 5 seconds to allow legitimate repeats
        setTimeout(() => {
            processedCommandRef.current = ""
        }, 5000)
    }

    /* -------- Helpers -------- */
    const playFillerAudio = (fillerKey: string) => {
        const audioFiles =
            tools.AUDIO_FILES[fillerKey as keyof typeof tools.AUDIO_FILES]
        if (!audioFiles || audioFiles.length === 0) {
            console.warn("⚠️ Unknown filler audio key:", fillerKey)
            return
        }

        // For now, use first audio file (can add randomization later)
        const audioFile = audioFiles[0]
        console.log("🎵 Playing filler audio:", fillerKey)

        const player = createAudioPlayer(audioFile)
        player.volume = 1.0
        player.play()
        player.addListener("playbackStatusUpdate", (s) => {
            if (s.isLoaded && s.didJustFinish) player.remove()
        })
    }

    /* -------- UI -------- */
    return (
        <View className="flex-1 bg-gray-900 pt-24">
            <ScrollView
                className="flex-1 w-full px-0 py-6"
                contentContainerStyle={{ paddingBottom: 160 }}
            >
                {/* Header */}
                <View className="w-full items-center px-6 mb-12 space-x-4 space-x-reverse">
                    <View className="w-16 h-16 rounded-full overflow-hidden bg-gray-700">
                        <Image
                            source={require("../assets/images/avatar.avif")}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                    <Text className="text-white text-4xl pt-4 text-right flex-1">
                        مساء الخير ، أحمد
                    </Text>
                </View>

                {/* Sections */}
                <BalanceSection userAccount={userAccount} />
                <CreditCardSection userCards={userCards} />
                <BillsSection userBills={userBills} />
                <TransactionSection userTransactions={userTransactions} />
            </ScrollView>

            {/* Mic button */}
            <Pressable
                onLongPress={micDisabled ? undefined : startListening}
                delayLongPress={300}
                onPressOut={micDisabled ? undefined : stopListening}
                disabled={micDisabled}
                className="
          rounded-full w-20 h-20
          items-center justify-center
          shadow-lg bg-emerald-600
        "
                style={{
                    position: "absolute",
                    bottom: 40,
                    alignSelf: "center",
                    opacity: micDisabled ? 0.4 : 1,
                    transform: [{ scale: isActive ? 1.1 : 1 }],
                }}
            >
                {isActive ? (
                    <ActivityIndicator size="large" color="#fff" />
                ) : (
                    <Feather name="mic" size={32} color="#fff" />
                )}
            </Pressable>
        </View>
    )
}
