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
import bankingData from "../assets/data/banking_data.json"
import tools from "../helpers/tools"
import { BankingContext, ChatMessage, BillSelectionData, BillPaymentData } from "../types/core"
import { createAudioPlayer } from "expo-audio"
import BillSelectionCard from "../components/BillSelectionCard"
import TransactionSuccessCard from "../components/TransactionSuccessCard"

const { width, height } = Dimensions.get("window")

// Voice states for visual feedback
type VoiceState = "idle" | "listening" | "processing" | "speaking"

export default function VoiceAssistantScreen() {
    // Voice interaction state
    const [voiceState, setVoiceState] = useState<VoiceState>("idle")
    const [aiResponse, setAiResponse] = useState("")
    const [userQuery, setUserQuery] = useState("")
    const [processingMessage, setProcessingMessage] = useState("جاري التفكير...")
    
    // Bill payment state
    const [showBillSelection, setShowBillSelection] = useState(false)
    const [billSelectionData, setBillSelectionData] = useState<BillSelectionData | null>(null)
    const [pendingBillPayment, setPendingBillPayment] = useState(false)
    const [currentBills, setCurrentBills] = useState(bankingData.bills)
    
    // Transaction success state
    const [showTransactionSuccess, setShowTransactionSuccess] = useState(false)
    const [transactionData, setTransactionData] = useState<any>(null)
    
    // Animation values (old API for some animations)
    const fadeAnim = useRef(new Animated.Value(0)).current
    const waveAnim = useRef(new Animated.Value(0)).current
    
    // New Reanimated API for button
    const wave1 = useSharedValue(0)
    const wave2 = useSharedValue(0) 
    const wave3 = useSharedValue(0)
    const buttonScale = useSharedValue(1)
    
    // Colors as shared values
    const currentColor = useSharedValue("#7C3AED") // Default purple
    
    // Button press state
    const [isPressed, setIsPressed] = useState(false)
    
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
    
    // Initialize history with current bills
    useEffect(() => {
        if (historyRef.current.length === 0) {
            historyRef.current = [{
                role: "system",
                content: tools.buildPrompt({
                    ...bankingData,
                    transactions: bankingData.transactions.january_2024,
                    bills: currentBills,
                } as unknown as BankingContext),
            }]
        }
    }, [currentBills])

    // Command processing
    const [commandBuffer, setCommandBuffer] = useState<string[]>([])
    const processedCommandRef = useRef<string>("")
    const [busy, setBusy] = useState(false)

    // Pulsing wave animation constants
    const WAVE_DURATION = 2000
    const WAVE_DELAY = WAVE_DURATION / 3

    // Setup pulsing animation for idle state
    useEffect(() => {
        // Entrance animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start()

        // Update color based on voice state
        switch (voiceState) {
            case "listening":
                currentColor.value = "#7C3AED"  // Purple for listening
                break
            case "processing":
                currentColor.value = "#3B82F6"  // Blue for processing
                break
            case "speaking":
                currentColor.value = "#8B5CF6"  // Light purple for speaking
                break
            default:
                currentColor.value = "#7C3AED"  // Purple for idle
                break
        }

        if (voiceState === "idle" || voiceState === "speaking") {
            // Start the professional pulsing waves for both idle and speaking states
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
        } else {
            // Stop pulsing only when listening or processing
            wave1.value = withTiming(0, { duration: 300 })
            wave2.value = withTiming(0, { duration: 300 })
            wave3.value = withTiming(0, { duration: 300 })
        }
    }, [voiceState])

    // Wave animation for listening and processing states
    useEffect(() => {
        if (voiceState === "listening" || voiceState === "processing") {
            const waveAnimation = Animated.loop(
                Animated.timing(waveAnim, {
                    toValue: 1,
                    duration: voiceState === "listening" ? 1000 : 800,
                    useNativeDriver: true,
                })
            )
            waveAnimation.start()
            return () => waveAnimation.stop()
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
            voiceState 
        })
        
        if (prevListening.current && !isListening) {
            // STT has stopped
            if (commandBuffer.length > 0) {
                // We have a command to process
                const finalCommand = commandBuffer.reduce((longest, current) =>
                    current.length > longest.length ? current : longest
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
            const smartLLMPromise = LLMService.processUserQuery(historyRef.current)

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
                console.log(`🎵 Playing filler audio: ${fastResult.fillerAudio}`)
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
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                await TTSService.speak(smartResult.response)
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
                }
            } else {
                // Regular response handling
                setVoiceState("speaking")
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                
                // Small delay to let TTS start before showing text
                setTimeout(() => {
                    setAiResponse(smartResult.response)
                }, 300)
                
                await TTSService.speak(smartResult.response)
            }
            
            // Keep the answer visible - don't return to idle automatically
            // User can press button again for new question
        } catch (error) {
            console.error("Voice command error:", error)
            await TTSService.speak("عذراً، حدث خطأ في معالجة طلبك")
            setVoiceState("idle")
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
                "1234" // Mock OTP for demo
            )
            
            if (result.success) {
                setShowBillSelection(false)
                setBillSelectionData(null)
                setPendingBillPayment(false)
                
                // Update the bills state and banking context for future queries
                if (result.updatedBills) {
                    setCurrentBills(result.updatedBills)
                    
                    const updatedContext = {
                        ...bankingData,
                        transactions: bankingData.transactions.january_2024,
                        bills: result.updatedBills
                    } as unknown as BankingContext
                    
                    // Update the system message in history with new data
                    historyRef.current[0] = {
                        role: "system",
                        content: tools.buildPrompt(updatedContext)
                    }
                }
                
                // Show transaction success screen
                const paidBills = currentBills.filter(bill => 
                    paymentData.final_bills.includes(bill.id)
                )
                
                setTransactionData({
                    transactionId: result.transactionId || `TXN${Date.now()}`,
                    paidBills: paidBills,
                    totalAmount: paymentData.total_amount,
                    paymentSource: paymentData.payment_source,
                    timestamp: new Date().toISOString()
                })
                
                setShowTransactionSuccess(true)
                setVoiceState("speaking")
                await TTSService.speak(result.message)
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

    const handleTransactionDismiss = () => {
        setShowTransactionSuccess(false)
        setTransactionData(null)
        setAiResponse("")
        setVoiceState("idle")
    }

    const playFillerAudio = (fillerKey: string) => {
        const audioFiles = tools.AUDIO_FILES[fillerKey as keyof typeof tools.AUDIO_FILES]
        if (!audioFiles || audioFiles.length === 0) return

        const player = createAudioPlayer(audioFiles[0])
        player.volume = 1.0
        player.play()
        player.addListener("playbackStatusUpdate", (s) => {
            if (s.isLoaded && s.didJustFinish) player.remove()
        })
    }

    const handleMicPress = () => {
        console.log("🎙️ Button pressed - Current state:", voiceState, "Busy:", busy)
        
        if ((voiceState === "idle" || voiceState === "speaking") && !busy && !isPressed) {
            setIsPressed(true)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            
            // Button press animation
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
        console.log("🎙️ Button released - Current state:", voiceState, "Pressed:", isPressed)
        
        if (isPressed) {
            setIsPressed(false)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            
            // Button release animation
            buttonScale.value = withTiming(1, { duration: 150 })
            
            // Stop listening if currently listening
            if (voiceState === "listening") {
                stopListening()
                // Reset to idle state immediately for visual feedback
                // The actual processing will be handled by the STT useEffect
                console.log("✅ Stopped listening")
            }
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
                return "#7C3AED"  // Purple for listening
            case "processing":
                return "#3B82F6"  // Blue for processing
            case "speaking":
                return "#8B5CF6"  // Light purple for speaking
            default:
                return "#7C3AED"  // Purple for idle
        }
    }

    // Wave animation styles for button
    const makeWaveStyle = (progress: any) =>
        useAnimatedStyle(() => ({
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: `${currentColor.value}33`, // 20% opacity
            transform: [
                {
                    scale: interpolate(progress.value, [0, 1], [1, 2]),
                },
            ],
            opacity: interpolate(progress.value, [0, 0.7, 1], [0.6, 0, 0]),
        }))

    const wave1Style = makeWaveStyle(wave1)
    const wave2Style = makeWaveStyle(wave2)
    const wave3Style = makeWaveStyle(wave3)

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }))

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
        <View style={{ flex: 1, justifyContent: 'center' }}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 40 }}>
                <Text
                    style={{
                        fontSize: 36,
                        color: '#1F2937',
                        fontFamily: 'AppFontBold',
                        textAlign: 'center',
                        marginBottom: 12,
                    }}
                >
                    المساعد الصوتي أنس
                </Text>
                <Text
                    style={{
                        fontSize: 20,
                        color: '#6B7280',
                        fontFamily: 'AppFontRegular',
                        textAlign: 'center',
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
                        backgroundColor: '#ffffff',
                        borderRadius: 16,
                        padding: 20,
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                >
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: '#1F2937', fontFamily: 'AppFontBold', textAlign: 'right' }}>
                            💰 اسأل عن رصيدك
                        </Text>
                        <Text style={{ fontSize: 14, color: '#6B7280', fontFamily: 'AppFontRegular', textAlign: 'right', marginTop: 4 }}>
                            "كم رصيدي؟"
                        </Text>
                    </View>
                </Pressable>

                <Pressable 
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                        handleVoiceCommand("كم صرفت على المطاعم؟")
                    }}
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 16,
                        padding: 20,
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                >
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: '#1F2937', fontFamily: 'AppFontBold', textAlign: 'right' }}>
                            📊 تحليل المصاريف
                        </Text>
                        <Text style={{ fontSize: 14, color: '#6B7280', fontFamily: 'AppFontRegular', textAlign: 'right', marginTop: 4 }}>
                            "كم صرفت على المطاعم؟"
                        </Text>
                    </View>
                </Pressable>

                <Pressable 
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                        handleVoiceCommand("ما الفواتير المستحقة؟")
                    }}
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 16,
                        padding: 20,
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                >
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: '#1F2937', fontFamily: 'AppFontBold', textAlign: 'right' }}>
                            🧾 الفواتير المستحقة
                        </Text>
                        <Text style={{ fontSize: 14, color: '#6B7280', fontFamily: 'AppFontRegular', textAlign: 'right', marginTop: 4 }}>
                            "ما الفواتير المستحقة؟"
                        </Text>
                    </View>
                </Pressable>
            </View>
        </View>
    )

    const renderListeningState = () => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text
                style={{
                    fontSize: 36,
                    color: '#1F2937',
                    fontFamily: 'AppFontBold',
                    textAlign: 'center',
                    marginBottom: 60,
                }}
            >
                أستمع إليك الآن
            </Text>

            {/* Professional Listening Indicator */}
            <View style={{ alignItems: 'center', marginBottom: 40 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {[1, 2, 3, 4, 5].map((index) => (
                        <Animated.View
                            key={index}
                            style={{
                                width: 6,
                                height: 60 + (index * 8),
                                backgroundColor: '#7C3AED',
                                borderRadius: 3,
                                transform: [{
                                    scaleY: waveAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.3, 1],
                                    })
                                }],
                            }}
                        />
                    ))}
                </View>
            </View>

            {/* Real-time Transcript */}
            {transcript && (
                <View
                    style={{
                        backgroundColor: '#FAF5FF',
                        borderRadius: 16,
                        padding: 24,
                        maxWidth: width - 60,
                        borderWidth: 1,
                        borderColor: '#E9D5FF',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 24,
                            color: '#1F2937',
                            fontFamily: 'AppFontRegular',
                            textAlign: 'center',
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Animated Processing Dots */}
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {[1, 2, 3].map((index) => (
                        <Animated.View
                            key={index}
                            style={{
                                width: 12,
                                height: 12,
                                backgroundColor: '#3B82F6',
                                borderRadius: 6,
                                transform: [{
                                    scale: waveAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.8, 1.2],
                                    })
                                }],
                                opacity: waveAnim.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [0.5, 1, 0.5],
                                })
                            }}
                        />
                    ))}
                </View>
            </View>
            
            <Text
                style={{
                    fontSize: 32,
                    color: '#1F2937',
                    fontFamily: 'AppFontBold',
                    textAlign: 'center',
                }}
            >
                {processingMessage}
            </Text>
        </View>
    )

    const renderSpeakingState = () => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
            {/* Transaction Success Card */}
            {showTransactionSuccess && transactionData && (
                <View style={{ flex: 1, justifyContent: 'center', width: '100%' }}>
                    <TransactionSuccessCard
                        data={transactionData}
                        onDismiss={handleTransactionDismiss}
                    />
                </View>
            )}
            
            {/* Bill Selection Card */}
            {showBillSelection && billSelectionData && !showTransactionSuccess && (
                <View style={{ flex: 1, justifyContent: 'center', width: '100%' }}>
                    <BillSelectionCard
                        data={billSelectionData}
                        onConfirm={handleBillConfirm}
                        onCancel={handleBillCancel}
                    />
                </View>
            )}
            
            {/* AI Response - Large and Centered */}
            {aiResponse && !showBillSelection && !showTransactionSuccess && (
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 32,
                            color: '#1F2937',
                            fontFamily: 'AppFontBold',
                            textAlign: 'center',
                            lineHeight: 48,
                            letterSpacing: 1,
                        }}
                    >
                        {aiResponse}
                    </Text>
                </View>
            )}
        </View>
    )

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
            
            {/* Close Button */}
            <Pressable
                onPress={() => router.back()}
                style={{
                    position: "absolute",
                    top: 60,
                    right: 20,
                    zIndex: 10,
                    backgroundColor: "rgba(124,58,237,0.1)",
                    borderRadius: 20,
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Feather name="x" size={24} color="#7C3AED" />
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
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                    paddingHorizontal: 24,
                    paddingTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Hold Button */}
                <View style={{ alignItems: 'center', justifyContent: 'center', width: 120, height: 120 }}>
                    {/* Professional Pulsing Waves - show when idle or speaking (ready for next question) */}
                    {(voiceState === "idle" || voiceState === "speaking") && (
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
                            style={[
                                {
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 8,
                                    elevation: 8,
                                    opacity: busy ? 0.6 : 1,
                                    zIndex: 1,
                                },
                                // Use regular React Native style for backgroundColor since we need dynamic updates
                                { 
                                    backgroundColor: getStateColor(),
                                    shadowColor: getStateColor(),
                                }
                            ]}
                        >
                            <Feather
                                name={voiceState === "listening" ? "square" : "mic"}
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