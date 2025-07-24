import React from "react"
import { View, Text } from "react-native"

const BalanceSection = ({
    userAccount,
    fontsLoaded,
}: {
    userAccount: any
    fontsLoaded: boolean
}) => (
    <View className="rounded-2xl p-6 mb-12">
        <View className="flex-row justify-between items-center mb-12">
            <Text
                className="text-white text-4xl"
                style={{
                    fontFamily: fontsLoaded ? "AppFontBold" : "System",
                }}
            >
                {userAccount.checking.balance.toLocaleString()}{" "}
                <Text className="text-blue-400 text-lg">SAR</Text>
            </Text>
            <Text
                className="text-gray-300 text-2xl"
                style={{
                    fontFamily: fontsLoaded ? "AppFontRegular" : "System",
                }}
            >
                الحساب الجاري
            </Text>
        </View>
        <View className="flex-row justify-between items-center">
            <Text
                className="text-white text-4xl"
                style={{
                    fontFamily: fontsLoaded ? "AppFontBold" : "System",
                }}
            >
                {userAccount.savings.balance.toLocaleString()}{" "}
                <Text className="text-blue-400 text-lg">SAR</Text>
            </Text>
            <Text
                className="text-gray-300 text-2xl"
                style={{
                    fontFamily: fontsLoaded ? "AppFontRegular" : "System",
                }}
            >
                حساب التوفير
            </Text>
        </View>
    </View>
)

export default BalanceSection
