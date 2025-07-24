import { View, Text, Pressable, ScrollView } from "react-native"
import { useState } from "react"
import TTSService, { TTSServiceClass } from "../services/TTSService"
import { PRERECORDED_AUDIO } from "../config/audioConfig"

const TestScreen = () => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [lastPlayed, setLastPlayed] = useState<string>("")

    const testPrerecorded = async (key: string) => {
        setIsPlaying(true)
        setLastPlayed(`Pre-recorded: ${key}`)
        await TTSService.speak(key, true) // English key for pre-recorded
        setIsPlaying(false)
    }

    const testGenerated = async (text: string) => {
        setIsPlaying(true)
        setLastPlayed(`Generated: ${text}`)
        await TTSService.speak(text, false) // Arabic text for generation
        setIsPlaying(false)
    }

    // Get configuration status from static methods
    const configStatus = TTSServiceClass.getConfigStatus()
    const isConfigured = TTSServiceClass.isConfigured()

    return (
        <ScrollView className="flex-1 bg-gray-900 p-6">
            <Text className="text-white text-2xl font-bold mb-6 text-center">
                اختبار خدمة التحويل للصوت
            </Text>

            {/* Configuration Status */}
            <View className="bg-gray-800 p-4 rounded-lg mb-6">
                <Text className="text-gray-300 text-sm mb-2">
                    إعدادات الـ API:
                </Text>
                <View className="flex-row items-center">
                    <Text
                        className={`text-lg ${isConfigured ? "text-green-400" : "text-red-400"}`}
                    >
                        {isConfigured ? "✅" : "❌"}
                    </Text>
                    <Text className="text-gray-300 ml-2">{configStatus}</Text>
                </View>
                {!isConfigured && (
                    <Text className="text-yellow-400 text-xs mt-2">
                        💡 قم بإعداد ملف .env بمفاتيح ElevenLabs
                    </Text>
                )}
            </View>

            {/* Status Display */}
            <View className="bg-gray-800 p-4 rounded-lg mb-6">
                <Text className="text-gray-300 text-sm mb-2">الحالة:</Text>
                {isPlaying ? (
                    <Text className="text-yellow-400 text-lg">
                        🔊 جاري التشغيل...
                    </Text>
                ) : (
                    <Text className="text-green-400 text-lg">✅ جاهز</Text>
                )}
                {lastPlayed && (
                    <Text className="text-gray-400 text-sm mt-2">
                        آخر تشغيل: {lastPlayed}
                    </Text>
                )}
            </View>

            {/* Pre-recorded Audio Tests */}
            <View className="mb-8">
                <Text className="text-blue-300 text-lg font-bold mb-4">
                    📼 الصوت المسجل مسبقاً (سريع)
                </Text>

                {Object.entries(PRERECORDED_AUDIO).map(([key, config]) => (
                    <Pressable
                        key={key}
                        onPress={() => testPrerecorded(key)}
                        disabled={isPlaying}
                        className={`p-4 rounded-lg mb-2 ${
                            isPlaying
                                ? "bg-gray-600"
                                : "bg-blue-600 active:bg-blue-700"
                        }`}
                    >
                        <Text className="text-white text-center font-medium">
                            {config.arabicText}
                        </Text>
                        <Text className="text-blue-200 text-center text-xs mt-1">
                            Key: {key}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* Generated Audio Tests */}
            <View className="mb-8">
                <Text className="text-pink-300 text-lg font-bold mb-4">
                    🤖 الصوت المولد بالذكاء الاصطناعي
                </Text>

                <Pressable
                    onPress={() =>
                        testGenerated(
                            "رصيدك خمسة آلاف ومئتان واثنان وستون ريال سعودي",
                        )
                    }
                    disabled={isPlaying || !isConfigured}
                    className={`p-4 rounded-lg mb-2 ${
                        isPlaying || !isConfigured
                            ? "bg-gray-600"
                            : "bg-pink-600 active:bg-pink-700"
                    }`}
                >
                    <Text className="text-white text-center font-medium">
                        رصيدك ٥٢٦٢ ريال
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() =>
                        testGenerated(
                            "صرفت ثلاثمئة وستون ريال على المطاعم هذا الشهر",
                        )
                    }
                    disabled={isPlaying || !isConfigured}
                    className={`p-4 rounded-lg mb-2 ${
                        isPlaying || !isConfigured
                            ? "bg-gray-600"
                            : "bg-pink-600 active:bg-pink-700"
                    }`}
                >
                    <Text className="text-white text-center font-medium">
                        مصاريف المطاعم
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() =>
                        testGenerated("تم تحويل خمسون ريال لأحمد بنجاح")
                    }
                    disabled={isPlaying || !isConfigured}
                    className={`p-4 rounded-lg mb-2 ${
                        isPlaying || !isConfigured
                            ? "bg-gray-600"
                            : "bg-pink-600 active:bg-pink-700"
                    }`}
                >
                    <Text className="text-white text-center font-medium">
                        تأكيد التحويل
                    </Text>
                </Pressable>
            </View>

            {/* Instructions */}
            <View className="bg-gray-800 p-4 rounded-lg">
                <Text className="text-gray-300 text-sm">
                    💡 الأزرار الزرقاء تشغل الصوت المسجل مسبقاً (سريع)
                </Text>
                <Text className="text-gray-300 text-sm mt-2">
                    💡 الأزرار الوردية تولد صوت جديد باستخدام الذكاء الاصطناعي
                </Text>
                {!isConfigured && (
                    <Text className="text-yellow-400 text-sm mt-2">
                        ⚠️ اضف مفاتيح ElevenLabs في ملف .env لتفعيل الصوت المولد
                    </Text>
                )}
            </View>
        </ScrollView>
    )
}

export default TestScreen
