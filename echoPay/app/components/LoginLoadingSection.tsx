import { ActivityIndicator, Text, View } from "react-native"

const LoginLoadingSection = ({ fontsLoaded }: { fontsLoaded: boolean }) => {
    return (
        <View className="items-center justify-center space-y-12">
            {/* Loading animation */}
            <ActivityIndicator size="large" color="#fff" className="mb-8" />
            <Text
                className="text-white text-xl"
                style={{
                    fontFamily: fontsLoaded ? "AppFontRegular" : "System",
                }}
            >
                جاري تشغيل المساعد الصوتي...
            </Text>
        </View>
    )
}

export default LoginLoadingSection
