import React from "react"
import { View, Text } from "react-native"

const BillsSection = ({
    userBills,
    fontsLoaded,
}: {
    userBills: any[]
    fontsLoaded: boolean
}) => (
    <View className="bg-gray-800 rounded-2xl p-6 mb-6">
        <Text
            className="text-white text-2xl mb-6"
            style={{
                fontFamily: fontsLoaded ? "AppFontBold" : "System",
            }}
        >
            الفواتير المستحقة
        </Text>
        {userBills.map((bill) => (
            <View key={bill.id} className="bg-gray-700 rounded-xl p-5 mb-4">
                <View className="flex-row justify-between items-center mb-4">
                    <Text
                        className="text-white text-lg flex-1"
                        style={{
                            fontFamily: fontsLoaded ? "AppFontBold" : "System",
                        }}
                    >
                        {bill.provider}
                    </Text>
                    <View className="items-end">
                        <Text
                            className="text-red-400 text-xl"
                            style={{
                                fontFamily: fontsLoaded
                                    ? "AppFontBold"
                                    : "System",
                            }}
                        >
                            {bill.amount.toLocaleString()}{" "}
                            <Text className="text-red-300 text-base">SAR</Text>
                        </Text>
                        <Text
                            className={`text-sm ${
                                bill.status === "مستحقة"
                                    ? "text-red-400"
                                    : bill.status === "مستحقة قريباً"
                                      ? "text-yellow-400"
                                      : "text-green-400"
                            }`}
                        >
                            {bill.status}
                        </Text>
                    </View>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="text-blue-400 text-base">{bill.type}</Text>
                    <Text className="text-gray-400 text-base">
                        استحقاق: {bill.dueDate}
                    </Text>
                </View>
            </View>
        ))}
    </View>
)

export default BillsSection
