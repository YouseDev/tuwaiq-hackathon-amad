import { Text } from "react-native"

const LoginTopSection = ({ fontsLoaded }: { fontsLoaded: boolean }) => {
    return (
        <>
            {/* App Name - Main Title */}
            <Text
                className="text-6xl text-white w-full font-bold text-center mb-4"
                style={{
                    fontFamily: fontsLoaded ? "AppFontBold" : "System",
                    lineHeight: 80,
                }}
            >
                آكو باي
            </Text>

            {/* AI Subtitle */}
            <Text
                className="text-3xl text-blue-100 w-full text-center mb-4"
                style={{
                    fontFamily: fontsLoaded ? "AppFontBold" : "System",
                }}
            >
                المساعد البنكي الصوتي
            </Text>
        </>
    )
}

export default LoginTopSection
