import React from "react"
import { View, Text } from "react-native"

const TransactionSection = ({
    userTransactions,
}: {
    userTransactions: any[]
}) => (
    <View className="rounded-2xl p-0 mb-12">
        <Text
            className="text-white text-3xl pr-2 mb-6 w-full text-right"
            style={{
                fontFamily: "AppFontBold",
            }}
        >
            العمليات
        </Text>
        {userTransactions.slice(0, 6).map((transaction, index) => (
            <View key={index} className="bg-gray-800 rounded-xl p-5 mb-3">
                <View className="flex-row justify-between items-center mb-3">
                    <Text
                        className="text-white text-lg flex-1 mr-4"
                        style={{
                            fontFamily: "AppFontBold",
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
                            fontFamily: "AppFontBold",
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
