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

import BalanceSection from "./components/BalanceSection"
import CreditCardSection from "./components/CreditCardSection"
import BillsSection from "./components/BillsSection"
import TransactionSection from "./components/TransactionSection"
import useSTTService from "./services/STTService"
import LLMService from "./services/LLMService"
import TTSService from "./services/TTSService" // ⬅️ NEW
import bankingData from "../assets/data/banking_data.json"

/* -------- Local filler clips -------- */
const FILLER = [
    require("../assets/audio/filler-1.mp3"),
    require("../assets/audio/filler-2.mp3"),
    require("../assets/audio/filler-3.mp3"),
    require("../assets/audio/filler-4.mp3"),
    require("../assets/audio/filler-5.mp3"),
    require("../assets/audio/filler-6.mp3"),
    require("../assets/audio/filler-7.mp3"),
]

export default function App() {
    /* -------- Demo banking data -------- */
    const [userAccount] = useState(bankingData.accounts)
    const [userCards] = useState(bankingData.creditCards)
    const [userBills] = useState(bankingData.bills)
    const [userTransactions] = useState(bankingData.transactions.january_2024)

    /* -------- Command buffer -------- */
    const [commandBuffer, setCommandBuffer] = useState<string[]>([])

    /* -------- STT -------- */
    const { startListening, stopListening, isActive, transcript, isListening } =
        useSTTService()

    /* -------- UI / busy -------- */
    const [busy, setBusy] = useState(false)
    const lastClip = useRef<number | null>(null)
    const micDisabled = busy

    /* -------- Collect transcripts -------- */
    useEffect(() => {
        const clean = transcript.trim()
        if (clean && !busy) setCommandBuffer((prev) => [...prev, clean])
    }, [transcript])

    /* -------- Detect STT stop -------- */
    const prevListening = useRef(isListening)
    useEffect(() => {
        if (prevListening.current && !isListening && commandBuffer.length) {
            handleAfterSTTStop()
        }
        prevListening.current = isListening
    }, [isListening])

    /* -------- Core flow -------- */
    const handleAfterSTTStop = async () => {
        setBusy(true)

        /* 1️⃣ Play non‑repeating filler */
        //playRandomFiller()

        /* 2️⃣ Send buffer to LLM */
        const query = commandBuffer.join(" ")
        setCommandBuffer([])

        const llmCtx = {
            user: {},
            accounts: userAccount,
            creditCards: userCards,
            transactions: userTransactions,
            bills: userBills,
            contacts: [],
        }

        let llmRes
        try {
            llmRes = await LLMService.processUserQuery(query, llmCtx)
            console.log("🤖 LLM Response:", llmRes)
        } catch (err) {
            console.error("❌ LLM call failed:", err)
        }

        /* 3️⃣ Speak LLM response text */
        if (llmRes?.response) {
            await TTSService.speak(llmRes.response)
        }

        setCommandBuffer([])
        setBusy(false)
    }

    /* -------- Helpers -------- */
    const playRandomFiller = () => {
        let idx: number
        do {
            idx = Math.floor(Math.random() * FILLER.length)
        } while (FILLER.length > 1 && idx === lastClip.current)

        lastClip.current = idx
        const player = createAudioPlayer(FILLER[idx])
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
