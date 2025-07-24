import { LinearGradient } from "expo-linear-gradient"
import { View } from "react-native"

const AppTopContainer = ({
    children,
    hasLoggedIn,
}: {
    children: React.ReactNode
    hasLoggedIn: boolean
}) => {
    return (
        <View
            style={{
                flex: hasLoggedIn ? 0.25 : 0.4,
                backgroundColor: "#fff",
            }}
        >
            <LinearGradient
                colors={["#0ea5e9", "#7dd3fc", "#ec4899"]} // sky-blue to sky-300 to pink-500
                locations={[0, 0.6, 1]} // Better gradient distribution
                className="flex-1 justify-center items-center px-9"
            >
                {children}
            </LinearGradient>
        </View>
    )
}

export default AppTopContainer
