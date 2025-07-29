import React, { useState, useEffect, useRef } from "react"
import {
    View,
    Text,
    Pressable,
    Animated,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    ScrollView,
} from "react-native"
import { router } from "expo-router"
import { Feather } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import ReanimatedAnimated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withDelay,
    interpolate,
    Easing,
} from "react-native-reanimated"
import useSTTService from "../services/STTService"
import LLMService from "../services/LLMService"
import FastLLMService from "../services/FastLLMService"
import TTSService from "../services/TTSService"
import PaymentService from "../services/PaymentService"
import TransferService from "../services/TransferService"
import bankingData from "../assets/data/banking_data.json"
import tools from "../helpers/tools"
import {
    BankingContext,
    ChatMessage,
    BillSelectionData,
    BillPaymentData,
    TransferSelectionData,
    TransferData,
} from "../types/core"
import { createAudioPlayer } from "expo-audio"
import BillSelectionCard from "../components/BillSelectionCard"
import TransferSelectionCard from "../components/TransferSelectionCard"
import TransactionSuccessCard from "../components/TransactionSuccessCard"
import VoiceOrb from "../components/VoiceOrb"
import { useTransactions } from "../context/TransactionContext"
import { useAccounts } from "../context/AccountContext"

const { width, height } = Dimensions.get("window")

// Voice states for visual feedback
type VoiceState = "idle" | "listening" | "processing" | "speaking"

export default function VoiceAssistantScreen() {
    // Transaction context
    const { transactions: currentTransactions, addTransactions } =
        useTransactions()
    const { deductFromAccount } = useAccounts()

    // Voice interaction state
    const [voiceState, setVoiceState] = useState<VoiceState>("idle")
    const [aiResponse, setAiResponse] = useState("")
    const [userQuery, setUserQuery] = useState("")
    const [processingMessage, setProcessingMessage] =
        useState("جاري التفكير...")

    // Bill payment state
    const [showBillSelection, setShowBillSelection] = useState(false)
    const [billSelectionData, setBillSelectionData] =
        useState<BillSelectionData | null>(null)
    const [pendingBillPayment, setPendingBillPayment] = useState(false)
    const [currentBills, setCurrentBills] = useState(bankingData.bills)
    
    // Transfer state
    const [showTransferSelection, setShowTransferSelection] = useState(false)
    const [transferSelectionData, setTransferSelectionData] =
        useState<TransferSelectionData | null>(null)
    const [pendingTransfer, setPendingTransfer] = useState(false)

    // Transaction success state
    const [showTransactionSuccess, setShowTransactionSuccess] = useState(false)
    const [transactionData, setTransactionData] = useState<any>(null)

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current
    const waveAnim = useRef(new Animated.Value(0)).current
    const buttonScale = useSharedValue(1)

    // Hold button wave animations - start immediately
    const wave1 = useSharedValue(0)
    const wave2 = useSharedValue(0)
    const wave3 = useSharedValue(0)

    // Start waves immediately when component mounts (like pulsingButton.md)
    React.useEffect(() => {
        const WAVE_DURATION = 2000
        const WAVE_DELAY = WAVE_DURATION / 3

        wave1.value = withRepeat(
            withTiming(1, {
                duration: WAVE_DURATION,
                easing: Easing.out(Easing.ease),
            }),
            -1,
            false,
        )
        wave2.value = withDelay(
            WAVE_DELAY,
            withRepeat(
                withTiming(1, {
                    duration: WAVE_DURATION,
                    easing: Easing.out(Easing.ease),
                }),
                -1,
                false,
            ),
        )
        wave3.value = withDelay(
            2 * WAVE_DELAY,
            withRepeat(
                withTiming(1, {
                    duration: WAVE_DURATION,
                    easing: Easing.out(Easing.ease),
                }),
                -1,
                false,
            ),
        )
    }, [])

    // Voice services
    const {
        startListening,
        stopListening,
        isActive,
        transcript,
        isListening,
        confidence,
    } = useSTTService()

    // Chat history for context - initialize with current bills
    const historyRef = useRef<ChatMessage[]>([])

    // Initialize history with current bills and transactions
    useEffect(() => {
        if (historyRef.current.length === 0) {
            historyRef.current = [
                {
                    role: "system",
                    content: tools.buildPrompt({
                        ...bankingData,
                        transactions: currentTransactions,
                        bills: currentBills,
                    } as unknown as BankingContext),
                },
            ]
        }
    }, [currentBills, currentTransactions])

    // Command processing
    const [commandBuffer, setCommandBuffer] = useState<string[]>([])
    const processedCommandRef = useRef<string>("")
    const [busy, setBusy] = useState(false)

    // Simple entrance animation
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start()
    }, [])

    // Processing animation
    useEffect(() => {
        if (voiceState === "processing") {
            const animation = Animated.loop(
                Animated.timing(waveAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            )
            animation.start()
            return () => animation.stop()
        } else {
            waveAnim.setValue(0)
        }
    }, [voiceState])

    // STT transcript processing
    useEffect(() => {
        const clean = transcript.trim()
        if (clean && !busy) {
            if (clean === processedCommandRef.current) return

            setCommandBuffer((prev) => {
                if (prev.length === 0 || prev[prev.length - 1] !== clean) {
                    return [...prev, clean]
                }
                return prev
            })
        }
    }, [transcript, busy])

    // Process command when STT stops
    const prevListening = useRef(isListening)
    useEffect(() => {
        console.log("🎤 STT state changed:", {
            prevListening: prevListening.current,
            isListening,
            commandBufferLength: commandBuffer.length,
            voiceState,
        })

        if (prevListening.current && !isListening) {
            // STT has stopped
            if (commandBuffer.length > 0) {
                // We have a command to process
                const finalCommand = commandBuffer.reduce((longest, current) =>
                    current.length > longest.length ? current : longest,
                )
                handleVoiceCommand(finalCommand)
            } else {
                // No command, return to idle
                console.log("🔄 No command detected, returning to idle")
                setVoiceState("idle")
            }
        }
        prevListening.current = isListening
    }, [isListening, commandBuffer])

    const handleVoiceCommand = async (command: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        setVoiceState("processing")
        setBusy(true)
        setCommandBuffer([])
        processedCommandRef.current = command
        setUserQuery(command)

        historyRef.current.push({
            role: "user",
            content: command,
        })

        try {
            console.log("🚀 Starting parallel LLM execution")
            const startTime = Date.now()

            // Start both LLMs in parallel
            const fastLLMPromise = FastLLMService.selectFillerAudio(command)
            const smartLLMPromise = LLMService.processUserQuery(
                historyRef.current,
            )

            // Wait for fast LLM first (should be much faster)
            const fastResult = await fastLLMPromise
            const fastDuration = Date.now() - startTime
            console.log(`⚡ FastLLM completed in ${fastDuration}ms`)

            // Update processing message immediately
            if (fastResult.waitingMessage) {
                setProcessingMessage(fastResult.waitingMessage)
            }

            // Play filler audio immediately
            if (fastResult.fillerAudio) {
                playFillerAudio(fastResult.fillerAudio)
                console.log(
                    `🎵 Playing filler audio: ${fastResult.fillerAudio}`,
                )
            }

            // Wait for smart LLM (should complete while filler is playing)
            const smartResult = await smartLLMPromise
            const totalDuration = Date.now() - startTime
            console.log(`🧠 SmartLLM completed in ${totalDuration}ms total`)

            historyRef.current.push({
                role: "assistant",
                content: smartResult.response,
            })

            // Handle different response types
            if (smartResult.type === "bill_selection") {
                // Show bill selection UI
                const billData = smartResult.actionData as BillSelectionData
                setBillSelectionData(billData)
                setShowBillSelection(true)
                setPendingBillPayment(true)

                setVoiceState("speaking")
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                )
                await TTSService.speak(smartResult.response)
                // Keep the response on screen - don't auto-reset to idle
            } else if (smartResult.type === "transfer_selection") {
                // Show transfer selection UI
                const transferData = smartResult.actionData as TransferSelectionData
                setTransferSelectionData(transferData)
                setShowTransferSelection(true)
                setPendingTransfer(true)

                setVoiceState("speaking")
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                )
                await TTSService.speak(smartResult.response)
                // Keep the response on screen - don't auto-reset to idle
            } else if (smartResult.type === "transfer_payment") {
                // Handle transfer confirmation
                const transferData = smartResult.actionData as TransferData
                if (transferData.action === "confirm_transfer") {
                    // Process the transfer
                    handleTransfer(transferData)
                } else if (transferData.action === "cancel") {
                    setShowTransferSelection(false)
                    setTransferSelectionData(null)
                    setPendingTransfer(false)
                    setVoiceState("speaking")
                    await TTSService.speak("تم إلغاء التحويل")
                }
            } else if (smartResult.type === "transfer_success") {
                // Handle transfer success (fallback for when Claude returns this type)
                const successData = smartResult.actionData as any
                
                // Create a mock TransferData object for processing
                const mockTransferData: TransferData = {
                    action: "confirm_transfer",
                    recipient_account: "SA44 3000 0001 1111 2222 3333",
                    recipient_name: successData.recipientName || "سارة الراشد",
                    amount: successData.amount || 50,
                    source_account: "checking",
                    requires_otp: true
                }
                
                // Process the transfer directly
                handleTransfer(mockTransferData)
            } else if (smartResult.type === "bill_payment") {
                // Handle payment confirmation
                const paymentData = smartResult.actionData as BillPaymentData

                if (paymentData.action === "confirm_payment") {
                    await handleBillPayment(paymentData)
                } else if (paymentData.action === "cancel") {
                    setShowBillSelection(false)
                    setBillSelectionData(null)
                    setPendingBillPayment(false)
                    setVoiceState("speaking")
                    await TTSService.speak(smartResult.response)
                    // Keep on speaking state
                }
            } else {
                // Regular response handling
                setVoiceState("speaking")
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                )

                // Small delay to let TTS start before showing text
                setTimeout(() => {
                    setAiResponse(smartResult.response)
                }, 300)

                await TTSService.speak(smartResult.response)

                // Keep on speaking state to show the answer permanently
            }
        } catch (error) {
            console.error("Voice command error:", error)
            await TTSService.speak("عذراً، حدث خطأ في معالجة طلبك")
            // Keep on speaking state to show error message
        }

        setBusy(false)
        setTimeout(() => {
            processedCommandRef.current = ""
        }, 5000)
    }

    const handleBillPayment = async (paymentData: BillPaymentData) => {
        try {
            setVoiceState("processing")
            setProcessingMessage("جاري معالجة الدفع...")

            const result = await PaymentService.processBillPayment(
                paymentData,
                currentBills,
                "1234", // Mock OTP for demo
            )

            if (result.success) {
                setShowBillSelection(false)
                setBillSelectionData(null)
                setPendingBillPayment(false)

                // Deduct payment amount from account
                deductFromAccount(paymentData.payment_source, paymentData.total_amount)

                // Get paid bills info for transaction history and success screen
                const paidBills = currentBills.filter((bill) =>
                    paymentData.final_bills.includes(bill.id),
                )

                // Update the bills state and banking context for future queries
                if (result.updatedBills) {
                    setCurrentBills(result.updatedBills)

                    // Create transaction entries for each paid bill

                    const newTransactions = paidBills.map((bill) => ({
                        id: `txn_${Date.now()}_${bill.id}`,
                        date: new Date().toISOString().split("T")[0],
                        description: `دفع فاتورة ${bill.provider}`,
                        amount: -bill.amount, // Negative for payment/debit (for display only)
                        type: "bill_payment",
                        category: "فواتير",
                        balance: bankingData.accounts.checking.balance, // Keep original balance (don't subtract)
                        merchant: bill.provider,
                        location: "المملكة العربية السعودية",
                    }))

                    // Add new transactions to the global transaction context
                    addTransactions(newTransactions)

                    console.log(
                        "💰 Added bill payment transactions:",
                        newTransactions.length,
                    )
                    newTransactions.forEach((tx) => {
                        console.log(`  - ${tx.description}: ${tx.amount} ريال`)
                    })

                    const updatedContext = {
                        ...bankingData,
                        transactions: [
                            ...newTransactions,
                            ...currentTransactions,
                        ],
                        bills: result.updatedBills,
                    } as unknown as BankingContext

                    // Update the system message in history with new data
                    historyRef.current[0] = {
                        role: "system",
                        content: tools.buildPrompt(updatedContext),
                    }
                }

                // Show transaction success screen
                // paidBills already calculated above

                setTransactionData({
                    transactionId: result.transactionId || `TXN${Date.now()}`,
                    paidBills: paidBills,
                    totalAmount: paymentData.total_amount,
                    paymentSource: paymentData.payment_source,
                    timestamp: new Date().toISOString(),
                })

                setShowTransactionSuccess(true)
                setVoiceState("speaking")
                await TTSService.speak(result.message)
                // Keep on speaking state to show transaction success
            } else {
                setAiResponse(result.message)
                setVoiceState("speaking")
                await TTSService.speak(result.message)
            }
        } catch (error) {
            console.error("Payment error:", error)
            setAiResponse("حدث خطأ في معالجة الدفع")
            setVoiceState("speaking")
            await TTSService.speak("حدث خطأ في معالجة الدفع")
        }
    }

    const handleBillConfirm = () => {
        setShowBillSelection(false)
        handleVoiceCommand("نعم أكد الدفع")
    }

    const handleBillCancel = () => {
        setShowBillSelection(false)
        setBillSelectionData(null)
        setPendingBillPayment(false)
        handleVoiceCommand("إلغاء الدفع")
    }

    const handleTransfer = async (transferData: TransferData) => {
        try {
            setVoiceState("processing")
            setProcessingMessage("جاري معالجة التحويل...")
            
            const result = await TransferService.processTransfer(
                transferData,
                "1234" // Mock OTP for demo
            )

            if (result.success) {
                setShowTransferSelection(false)
                setTransferSelectionData(null)
                setPendingTransfer(false)

                // Deduct transfer amount from account
                deductFromAccount(transferData.source_account, transferData.amount)

                // Create transaction entry for transfer
                const newTransaction = {
                    id: `txn_${Date.now()}`,
                    date: new Date().toISOString().split("T")[0],
                    description: `تحويل إلى ${transferData.recipient_name}`,
                    amount: -transferData.amount,
                    type: "transfer_out",
                    category: "تحويلات",
                    recipient: transferData.recipient_name
                }

                // Add to transaction history
                addTransactions([newTransaction])

                // Set transaction data for success screen
                setTransactionData({
                    id: result.transactionId,
                    type: "transfer",
                    amount: transferData.amount,
                    recipient: transferData.recipient_name,
                    sourceAccount: transferData.source_account,
                    message: result.message,
                    updatedBalances: result.updatedBalances
                })

                setShowTransactionSuccess(true)
                setVoiceState("speaking")
                await TTSService.speak(result.message)
                // Keep on speaking state to show transaction success
            } else {
                setAiResponse(result.message)
                setVoiceState("speaking")
                await TTSService.speak(result.message)
            }
        } catch (error) {
            console.error("Transfer error:", error)
            setAiResponse("حدث خطأ في معالجة التحويل")
            setVoiceState("speaking")
            await TTSService.speak("حدث خطأ في معالجة التحويل")
        }
    }

    const handleTransferConfirm = () => {
        setShowTransferSelection(false)
        handleVoiceCommand("نعم أكد التحويل")
    }

    const handleTransferCancel = () => {
        setShowTransferSelection(false)
        setTransferSelectionData(null)
        setPendingTransfer(false)
        handleVoiceCommand("إلغاء التحويل")
    }

    const handleTransactionDismiss = () => {
        setShowTransactionSuccess(false)
        setTransactionData(null)
        setAiResponse("")
        // Don't auto-reset to idle - keep the current state
    }

    const playFillerAudio = (fillerKey: string) => {
        const audioFiles =
            tools.AUDIO_FILES[fillerKey as keyof typeof tools.AUDIO_FILES]
        if (!audioFiles || audioFiles.length === 0) return

        const player = createAudioPlayer(audioFiles[0])
        player.volume = 1.0
        player.play()
        player.addListener("playbackStatusUpdate", (s) => {
            if (s.isLoaded && s.didJustFinish) player.remove()
        })
    }

    const handleMicPress = () => {
        console.log(
            "🎙️ Button pressed - Current state:",
            voiceState,
            "Busy:",
            busy,
        )

        if ((voiceState === "idle" || voiceState === "speaking") && !busy) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

            // Simple button press animation
            buttonScale.value = withTiming(0.9, { duration: 150 })

            // Clear previous response when starting new question
            if (voiceState === "speaking") {
                setAiResponse("")
                setUserQuery("")
            }

            // Reset bill payment and transaction state if not pending
            if (!pendingBillPayment) {
                setShowBillSelection(false)
                setBillSelectionData(null)
                setShowTransactionSuccess(false)
                setTransactionData(null)
            }

            // Reset processing message
            setProcessingMessage("جاري التفكير...")

            // Change to listening state
            setVoiceState("listening")
            startListening()

            console.log("✅ Started listening")
        }
    }

    const handleMicRelease = () => {
        console.log("🎙️ Button released - Current state:", voiceState)

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

        // Button release animation
        buttonScale.value = withTiming(1, { duration: 150 })

        // Stop listening if currently listening
        if (voiceState === "listening") {
            stopListening()
            console.log("✅ Stopped listening")
        }
    }

    const getStateMessage = () => {
        switch (voiceState) {
            case "idle":
                return "مرحباً أحمد، أنا أنس مساعدك الصوتي"
            case "listening":
                return "أستمع إليك..."
            case "processing":
                return "جاري التفكير..."
            case "speaking":
                return "إجابة ذكية"
            default:
                return ""
        }
    }

    const getStateColor = () => {
        switch (voiceState) {
            case "listening":
                return "#374151" // Dark gray for listening
            case "processing":
                return "#6B7280" // Medium gray for processing
            case "speaking":
                return "#1F2937" // Very dark gray for speaking
            default:
                return "#000000" // Black for idle
        }
    }

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }))

    // Wave animation styles for button (following pulsingButton.md pattern)
    const makeWaveStyle = (progress: any) =>
        useAnimatedStyle(() => {
            "worklet"
            // Use a static color for waves to avoid calling getStateColor on UI thread
            const waveColor = "#37415133" // Dark gray with opacity

            return {
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: waveColor,
                transform: [
                    {
                        scale: interpolate(progress.value, [0, 1], [1, 3]),
                    },
                ],
                opacity: interpolate(progress.value, [0, 0.7, 1], [0.6, 0, 0]),
            }
        })

    const wave1Style = makeWaveStyle(wave1)
    const wave2Style = makeWaveStyle(wave2)
    const wave3Style = makeWaveStyle(wave3)

    const renderContentArea = () => {
        switch (voiceState) {
            case "idle":
                return renderWelcomeState()
            case "listening":
                return renderListeningState()
            case "processing":
                return renderProcessingState()
            case "speaking":
                return renderSpeakingState()
            default:
                return renderWelcomeState()
        }
    }

    const renderWelcomeState = () => (
        <View style={{ flex: 1, justifyContent: "center" }}>
            {/* Header with Orb */}
            <View style={{ alignItems: "center", marginBottom: 40 }}>
                {/* Gentle Voice Orb */}
                <View style={{ marginBottom: 20 }}>
                    <VoiceOrb mode="idle" size={60} color="#6B7280" />
                </View>

                <Text
                    style={{
                        fontSize: 36,
                        color: "#000000",
                        fontFamily: "AppFontBold",
                        textAlign: "center",
                        marginBottom: 12,
                    }}
                >
                    المساعد الصوتي أنس
                </Text>
                <Text
                    style={{
                        fontSize: 20,
                        color: "#6B7280",
                        fontFamily: "AppFontRegular",
                        textAlign: "center",
                        lineHeight: 28,
                    }}
                >
                    مساعدك المصرفي للإجابة وتنفيذ جميع عملياتك المصرفية
                </Text>
            </View>

            {/* Quick Action Cards */}
            <View style={{ gap: 16 }}>
                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                        handleVoiceCommand("كم رصيدي؟")
                    }}
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <View style={{ alignItems: "flex-start", flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: "#6B7280",
                                    fontFamily: "AppFontRegular",
                                    textAlign: "left",
                                    marginTop: 2,
                                }}
                            >
                                "كم رصيدي؟"
                            </Text>
                        </View>
                        <View
                            style={{
                                alignItems: "flex-end",
                                flex: 1,
                                marginRight: 12,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: "#000000",
                                    fontFamily: "AppFontBold",
                                    textAlign: "right",
                                }}
                            >
                                💰 اسأل عن رصيدك
                            </Text>
                        </View>
                        <Feather name="mic" size={20} color="#6B7280" />
                    </View>
                </Pressable>

                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                        handleVoiceCommand("كم صرفت على المطاعم؟")
                    }}
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <View style={{ alignItems: "flex-start", flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: "#6B7280",
                                    fontFamily: "AppFontRegular",
                                    textAlign: "left",
                                    marginTop: 2,
                                }}
                            >
                                "كم صرفت على المطاعم؟"
                            </Text>
                        </View>
                        <View
                            style={{
                                alignItems: "flex-end",
                                flex: 1,
                                marginRight: 12,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: "#000000",
                                    fontFamily: "AppFontBold",
                                    textAlign: "right",
                                }}
                            >
                                📊 تحليل المصاريف
                            </Text>
                        </View>
                        <Feather name="mic" size={20} color="#6B7280" />
                    </View>
                </Pressable>

                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                        handleVoiceCommand("ما الفواتير المستحقة؟")
                    }}
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <View style={{ alignItems: "flex-start", flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: "#6B7280",
                                    fontFamily: "AppFontRegular",
                                    textAlign: "left",
                                    marginTop: 2,
                                }}
                            >
                                "ادفع فواتير الكهرباء"
                            </Text>
                        </View>
                        <View
                            style={{
                                alignItems: "flex-end",
                                flex: 1,
                                marginRight: 12,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: "#000000",
                                    fontFamily: "AppFontBold",
                                    textAlign: "right",
                                }}
                            >
                                🧾 دفع الفواتير
                            </Text>
                        </View>
                        <Feather name="mic" size={20} color="#6B7280" />
                    </View>
                </Pressable>

                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                        handleVoiceCommand("حول ألف ريال لأحمد")
                    }}
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <View style={{ alignItems: "flex-start", flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: "#6B7280",
                                    fontFamily: "AppFontRegular",
                                    textAlign: "left",
                                    marginTop: 2,
                                }}
                            >
                                "حول ألف ريال لأحمد"
                            </Text>
                        </View>
                        <View
                            style={{
                                alignItems: "flex-end",
                                flex: 1,
                                marginRight: 12,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: "#000000",
                                    fontFamily: "AppFontBold",
                                    textAlign: "right",
                                }}
                            >
                                💸 تحويل الأموال
                            </Text>
                        </View>
                        <Feather name="mic" size={20} color="#6B7280" />
                    </View>
                </Pressable>

                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                        handleVoiceCommand("اقفل بطاقتي")
                    }}
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <View style={{ alignItems: "flex-start", flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: "#6B7280",
                                    fontFamily: "AppFontRegular",
                                    textAlign: "left",
                                    marginTop: 2,
                                }}
                            >
                                "اقفل بطاقتي"
                            </Text>
                        </View>
                        <View
                            style={{
                                alignItems: "flex-end",
                                flex: 1,
                                marginRight: 12,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: "#000000",
                                    fontFamily: "AppFontBold",
                                    textAlign: "right",
                                }}
                            >
                                🔒 حماية البطاقة
                            </Text>
                        </View>
                        <Feather name="mic" size={20} color="#6B7280" />
                    </View>
                </Pressable>
            </View>
        </View>
    )

    const renderListeningState = () => (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            {/* Voice Orb Animation */}
            <View style={{ marginBottom: 40 }}>
                <VoiceOrb mode="listening" size={120} color="#000000" />
            </View>

            <Text
                style={{
                    fontSize: 36,
                    color: "#000000",
                    fontFamily: "AppFontBold",
                    textAlign: "center",
                    marginBottom: 40,
                }}
            >
                أستمع إليك الآن
            </Text>

            {/* Real-time Transcript */}
            {transcript && (
                <View
                    style={{
                        backgroundColor: "#FAF5FF",
                        borderRadius: 16,
                        padding: 24,
                        maxWidth: width - 60,
                        borderWidth: 1,
                        borderColor: "#E9D5FF",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 24,
                            color: "#000000",
                            fontFamily: "AppFontRegular",
                            textAlign: "center",
                            lineHeight: 36,
                        }}
                    >
                        "{transcript}"
                    </Text>
                </View>
            )}
        </View>
    )

    const renderProcessingState = () => (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            {/* Animated Processing Dots */}
            <View style={{ alignItems: "center", marginBottom: 30 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    {[1, 2, 3].map((index) => (
                        <Animated.View
                            key={index}
                            style={{
                                width: 12,
                                height: 12,
                                backgroundColor: "#000000",
                                borderRadius: 6,
                                transform: [
                                    {
                                        scale: waveAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.8, 1.2],
                                        }),
                                    },
                                ],
                                opacity: waveAnim.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [0.5, 1, 0.5],
                                }),
                            }}
                        />
                    ))}
                </View>
            </View>

            <Text
                style={{
                    fontSize: 32,
                    color: "#000000",
                    fontFamily: "AppFontBold",
                    textAlign: "center",
                }}
            >
                {processingMessage}
            </Text>
        </View>
    )

    const renderSpeakingState = () => (
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40 }}>
            {/* Fixed content area to prevent jumping */}
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 400, // Fixed minimum height to prevent jumping
                }}
            >
                {/* Transaction Success Card */}
                {showTransactionSuccess && transactionData && (
                    <View style={{ width: "100%" }}>
                        <TransactionSuccessCard
                            data={transactionData}
                            onDismiss={handleTransactionDismiss}
                        />
                    </View>
                )}

                {/* Bill Selection Card */}
                {showBillSelection &&
                    billSelectionData &&
                    !showTransactionSuccess && (
                        <View style={{ width: "100%" }}>
                            <BillSelectionCard
                                data={billSelectionData}
                                onConfirm={handleBillConfirm}
                                onCancel={handleBillCancel}
                            />
                        </View>
                    )}

                {/* Transfer Selection Card */}
                {showTransferSelection &&
                    transferSelectionData &&
                    !showTransactionSuccess && (
                        <View style={{ width: "100%" }}>
                            <TransferSelectionCard
                                transferData={transferSelectionData}
                                onConfirm={handleTransferConfirm}
                                onCancel={handleTransferCancel}
                            />
                        </View>
                    )}

                {/* AI Response with fixed positioning */}
                {aiResponse &&
                    !showBillSelection &&
                    !showTransferSelection &&
                    !showTransactionSuccess && (
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#ffffff",
                                borderRadius: 16,
                                padding: 24,
                                width: "100%",
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 32,
                                    color: "#000000",
                                    fontFamily: "AppFontBold",
                                    textAlign: "center",
                                    lineHeight: 48,
                                }}
                            >
                                {aiResponse}
                            </Text>
                        </View>
                    )}
            </View>
        </View>
    )

    return (
        <View style={{ flex: 1, backgroundColor: "#f9eeea" }}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9eeea" />

            {/* Close Button */}
            <Pressable
                onPress={() => router.back()}
                style={{
                    position: "absolute",
                    top: 60,
                    right: 20,
                    zIndex: 10,
                    backgroundColor: "rgba(0,0,0,0.1)",
                    borderRadius: 20,
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Feather name="x" size={24} color="#000000" />
            </Pressable>

            {/* Main Content Area - 80% */}
            <Animated.View
                style={{
                    flex: 0.8,
                    opacity: fadeAnim,
                    paddingTop: 100,
                }}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 24,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {renderContentArea()}
                </ScrollView>
            </Animated.View>

            {/* Fixed Bottom Interaction Area - 20% */}
            <View
                style={{
                    flex: 0.2,
                    backgroundColor: "#ffffff",
                    borderTopWidth: 1,
                    borderTopColor: "#E5E7EB",
                    paddingHorizontal: 24,
                    paddingTop: 4,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* Hold Button with Waves */}
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 120,
                        height: 120,
                    }}
                >
                    {/* Pulsing Waves - show for listening state */}
                    {voiceState === "listening" && (
                        <>
                            <ReanimatedAnimated.View style={wave1Style} />
                            <ReanimatedAnimated.View style={wave2Style} />
                            <ReanimatedAnimated.View style={wave3Style} />
                        </>
                    )}

                    {/* Main Button */}
                    <ReanimatedAnimated.View style={buttonAnimatedStyle}>
                        <Pressable
                            onPressIn={handleMicPress}
                            onPressOut={handleMicRelease}
                            disabled={busy}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: getStateColor(),
                                shadowColor: getStateColor(),
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8,
                                opacity: busy ? 0.6 : 1,
                                zIndex: 1,
                            }}
                        >
                            <Feather
                                name={
                                    voiceState === "listening"
                                        ? "square"
                                        : "mic"
                                }
                                size={32}
                                color="#fff"
                            />
                        </Pressable>
                    </ReanimatedAnimated.View>
                </View>
            </View>
        </View>
    )
}
