import React, { useState, useEffect, useRef } from "react"
import { View, Text, ScrollView } from "react-native"
import bankingData from "../../assets/data/banking_data.json"
import BalanceSection from "./BalanceSection"
import CreditCardSection from "./CreditCardSection"
import BillsSection from "./BillsSection"
import TransactionSection from "./TransactionSection"
import LLMService from "../services/LLMService"
import TTSService from "../services/TTSService"

const BankContainer = ({
    fontsLoaded,
    stt,
}: {
    fontsLoaded: boolean
    stt: {
        startListening: () => Promise<boolean>
        stopListening: () => Promise<void>
        isListening: boolean
        recovering: boolean
        transcript: string
        error: string
        confidence: number
        hasError: boolean
        isActive: boolean
    }
}) => {
    const [showLoginSuccess, setShowLoginSuccess] = useState(true)
    const [userAccount, setUserAccount] = useState(bankingData.accounts)
    const [userCards, setUserCards] = useState(bankingData.creditCards)
    const [userBills, setUserBills] = useState(bankingData.bills)
    const [userTransactions, setUserTransactions] = useState(
        bankingData.transactions.january_2024,
    )

    // STT Buffer for LLM processing
    const [sttBuffer, setSttBuffer] = useState("")
    const silenceTimer = useRef<number | null>(null)
    const lastTranscript = useRef("")

    useEffect(() => {
        // Hide login success after 2 seconds and start STT listening
        const timer = setTimeout(() => {
            setShowLoginSuccess(false)
            console.log(
                "🎤 BankContainer ready - STT should be active:",
                stt.isActive,
            )
            if (!stt.isListening) {
                stt.startListening()
                console.log("🎤 STT restarted in BankContainer")
            }
        }, 2000)

        return () => clearTimeout(timer)
    }, [stt])

    // STT Buffer Logic - accumulate speech and process after 1.5s silence
    useEffect(() => {
        // Only process if we're in banking UI and transcript is not empty
        if (!showLoginSuccess && stt.transcript) {
            const currentTranscript = stt.transcript.trim()

            // Skip if empty or same as previous transcript
            if (
                !currentTranscript ||
                currentTranscript === lastTranscript.current
            ) {
                return
            }

            // Update last transcript tracker
            lastTranscript.current = currentTranscript

            // Replace buffer with latest transcript (STT is already cumulative)
            setSttBuffer(currentTranscript)
            console.log("📝 Buffer updated:", currentTranscript)

            // Clear existing timer and start new 2s countdown
            if (silenceTimer.current) {
                clearTimeout(silenceTimer.current)
            }

            silenceTimer.current = setTimeout(async () => {
                // Process buffer after 2s of silence
                setSttBuffer((currentBuffer) => {
                    if (currentBuffer.trim()) {
                        console.log(
                            "🧠 Processing buffer after silence:",
                            currentBuffer,
                        )

                        // Send to LLM service
                        handleLLMProcessing(currentBuffer)

                        return "" // Clear buffer after processing
                    }
                    return currentBuffer
                })
            }, 2000)
        }

        return () => {
            if (silenceTimer.current) {
                clearTimeout(silenceTimer.current)
            }
        }
    }, [stt.transcript, showLoginSuccess])

    // Handle LLM processing of user input
    const handleLLMProcessing = async (userInput: string) => {
        try {
            const bankingContext = {
                user: bankingData.user,
                accounts: userAccount,
                creditCards: userCards,
                transactions: userTransactions,
                bills: userBills,
                contacts: bankingData.contacts,
            }

            const llmResponse = await LLMService.processUserQuery(
                userInput,
                bankingContext,
            )

            if (llmResponse.type === "ignore") {
                console.log("🚫 LLM ignored request")
                return
            }

            // Play filler audio immediately if specified
            if (llmResponse.fillerAudio) {
                console.log("🎵 Playing filler audio:", llmResponse.fillerAudio)
                // TODO: Add filler audio files to audioConfig and play here
            }

            // Speak the LLM response
            if (llmResponse.response) {
                await TTSService.speak(llmResponse.response, false)
            }

            // Handle actions (transfers, bill payments, etc.)
            if (llmResponse.type === "action" && llmResponse.needsOTP) {
                console.log("🔐 Action requires OTP verification")
                // TODO: Implement OTP flow for actions
            }
        } catch (error) {
            console.error("❌ LLM processing error:", error)
            await TTSService.speak("عذراً، حدث خطأ في معالجة طلبك", false)
        }
    }

    if (showLoginSuccess) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-green-400 text-6xl mb-4">✅</Text>
                <Text
                    className="text-white text-xl text-center"
                    style={{
                        fontFamily: fontsLoaded ? "AppFontBold" : "System",
                    }}
                >
                    تم تسجيل الدخول بنجاح
                </Text>
            </View>
        )
    }

    return (
        <ScrollView
            className="flex-1 px-0 py-6 w-full"
            contentContainerStyle={{ paddingBottom: 100 }}
        >
            <BalanceSection
                userAccount={userAccount}
                fontsLoaded={fontsLoaded}
            />
            <CreditCardSection
                userCards={userCards}
                fontsLoaded={fontsLoaded}
            />
            <BillsSection userBills={userBills} fontsLoaded={fontsLoaded} />
            <TransactionSection
                userTransactions={userTransactions}
                fontsLoaded={fontsLoaded}
            />
        </ScrollView>
    )
}

export default BankContainer
