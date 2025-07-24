import React from "react"
import { View, Text } from "react-native"

const TransactionSection = ({
    userTransactions,
    fontsLoaded,
}: {
    userTransactions: any[]
    fontsLoaded: boolean
}) => (
    <View className="rounded-2xl p-0 mb-6">
        <Text
            className="text-white text-2xl mb-6 w-full text-right"
            style={{
                fontFamily: fontsLoaded ? "AppFontBold" : "System",
            }}
        >
            المعاملات الأخيرة
        </Text>
        {userTransactions.slice(0, 6).map((transaction, index) => (
            <View key={index} className="bg-gray-800 rounded-xl p-5 mb-3">
                <View className="flex-row justify-between items-center mb-3">
                    <Text
                        className="text-white text-lg flex-1 mr-4"
                        style={{
                            fontFamily: fontsLoaded ? "AppFontBold" : "System",
                        }}
                    >
                        {transaction.merchant}
                    </Text>
                    <Text
                        className={`text-xl ${
                            transaction.amount > 0
                                ? "text-green-400"
                                : "text-red-400"
                        }`}
                        style={{
                            fontFamily: fontsLoaded ? "AppFontBold" : "System",
                        }}
                    >
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount.toLocaleString()}{" "}
                        <Text className="text-base text-gray-400">ر.س</Text>
                    </Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="text-blue-400 text-base">
                        {transaction.category}
                    </Text>
                    <Text className="text-gray-400 text-base">
                        {transaction.date}
                    </Text>
                </View>
            </View>
        ))}
    </View>
)

export default TransactionSection
