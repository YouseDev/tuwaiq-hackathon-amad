import { SafeAreaView, View } from "react-native"

const AppContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View className="flex-1">{children}</View>
        </SafeAreaView>
    )
}

export default AppContainer
