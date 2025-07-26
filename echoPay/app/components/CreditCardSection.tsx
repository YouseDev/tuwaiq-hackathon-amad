import React from "react"
import { View, Text } from "react-native"

const CreditCardSection = ({ userCards }: { userCards: any[] }) => (
    <View className="rounded-2xl p-0 mb-6">
        <Text
            className="text-white text-3xl pr-2 w-full text-right mb-6"
            style={{
                fontFamily: "AppFontBold",
            }}
        >
            البطاقات
        </Text>
        {userCards.map((card) => (
            <View key={card.id} className="bg-gray-800 rounded-xl p-5 mb-8">
                <View className="flex-row justify-between items-center mb-8">
                    <Text
                        className="text-white text-lg flex-1"
                        style={{
                            fontFamily: "AppFontBold",
                        }}
                    >
                        {card.cardType}
                    </Text>
                    <Text className="text-gray-400 text-base">
                        {card.cardNumber}
                    </Text>
                </View>
                <View className="flex-row justify-between items-center mb-3">
                    <Text
                        className="text-green-400 text-xl"
                        style={{
                            fontFamily: "AppFontBold",
                        }}
                    >
                        {card.availableCredit.toLocaleString()}{" "}
                        <Text className="text-green-300 text-base">SAR</Text>
                    </Text>
                    <Text className="text-gray-300 text-lg">الحد المتاح</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text
                        className="text-orange-400 text-xl"
                        style={{
                            fontFamily: "AppFontBold",
                        }}
                    >
                        {card.usedCredit.toLocaleString()}{" "}
                        <Text className="text-orange-300 text-base">SAR</Text>
                    </Text>
                    <Text className="text-gray-300 text-lg">المستخدم</Text>
                </View>
            </View>
        ))}
    </View>
)

export default CreditCardSection
