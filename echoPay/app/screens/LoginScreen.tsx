import React from "react"
import { View, Text, ActivityIndicator, Image } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useFonts } from "expo-font"
import { Beiruti_400Regular, Beiruti_700Bold } from "@expo-google-fonts/beiruti"

const LoginScreen = ({ isLoading }: { isLoading: boolean }) => {
    // Load fonts - Custom names for better organization
    const [fontsLoaded] = useFonts({
        AppFontRegular: Beiruti_400Regular,
        AppFontBold: Beiruti_700Bold,
    })

    return (
        <View className="flex-1">
            {/* Top Section - 40% with Beautiful Gradient */}
            <View style={{ flex: 0.4, backgroundColor: "#fff" }}>
                <LinearGradient
                    colors={["#0ea5e9", "#7dd3fc", "#ec4899"]} // sky-blue to sky-300 to pink-500
                    locations={[0, 0.6, 1]} // Better gradient distribution
                    className="flex-1 justify-center items-center px-9"
                >
                    {/* App Name - Main Title */}
                    <Text
                        className="text-6xl text-white w-full font-bold text-center mb-2"
                        style={{
                            fontFamily: fontsLoaded ? "AppFontBold" : "System",
                            lineHeight: 80,
                        }}
                    >
                        آكو باي
                    </Text>

                    {/* AI Subtitle */}
                    <Text
                        className="text-2xl text-blue-100 w-full text-center mb-4"
                        style={{
                            fontFamily: fontsLoaded ? "AppFontBold" : "System",
                        }}
                    >
                        البنك الصوتي
                    </Text>
                </LinearGradient>
            </View>

            {/* Bottom Section - 60% with Curved Top and Dark Background */}
            <View style={{ flex: 0.6 }} className="bg-pink-400">
                <View
                    className="flex-1 justify-center items-center px-6"
                    style={{
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                        marginTop: -20, // Overlap slightly for seamless look
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -5 },
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 10, // Android shadow
                        backgroundColor: "#111827", // Ensure solid dark background
                    }}
                >
                    {isLoading ? (
                        // Loading State
                        <View className="items-center justify-center space-y-12">
                            {/* Loading animation */}
                            <ActivityIndicator
                                size="large"
                                color="#fff"
                                className="mb-8"
                            />
                            <Text
                                className="text-white text-xl"
                                style={{
                                    fontFamily: fontsLoaded
                                        ? "AppFontRegular"
                                        : "System",
                                }}
                            >
                                جاري تشغيل المساعد الصوتي...
                            </Text>
                        </View>
                    ) : (
                        // Ready State - Placeholder for glowing orb
                        <View className="items-center justify-center space-y-12">
                            {/* Placeholder for glowing orb */}
                            <Text className="text-white text-lg">
                                جاهز لرقم التعريف الصوتي
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    )
}

export default LoginScreen
