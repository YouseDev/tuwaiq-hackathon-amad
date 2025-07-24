import { View } from "react-native"

const AppBottomContainer = ({
    children,
    hasLoggedIn,
}: {
    children: React.ReactNode
    hasLoggedIn: boolean
}) => {
    return (
        <View
            style={{ flex: hasLoggedIn ? 0.75 : 0.6 }}
            className="bg-pink-400"
        >
            <View
                className="flex-1 justify-center items-center px-4"
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
                {children}
            </View>
        </View>
    )
}

export default AppBottomContainer
