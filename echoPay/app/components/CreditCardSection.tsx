import React from "react"
import { View, Text } from "react-native"

const CreditCardSection = ({
    userCards,
    fontsLoaded,
}: {
    userCards: any[]
    fontsLoaded: boolean
}) => (
    <View className="rounded-2xl p-0 mb-6">
        {userCards.map((card) => (
            <View key={card.id} className="bg-gray-800 rounded-xl p-5 mb-8">
                <View className="flex-row justify-between items-center mb-8">
                    <Text
                        className="text-white text-lg flex-1"
                        style={{
                            fontFamily: fontsLoaded ? "AppFontBold" : "System",
                        }}
                    >
                        {card.cardType}
                    </Text>
                    <Text className="text-gray-400 text-base">
                        {card.cardNumber}
                    </Text>
                </View>
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-gray-300 text-lg">الحد المتاح</Text>
                    <Text
                        className="text-green-400 text-xl"
                        style={{
                            fontFamily: fontsLoaded ? "AppFontBold" : "System",
                        }}
                    >
                        {card.availableCredit.toLocaleString()}{" "}
                        <Text className="text-green-300 text-base">SAR</Text>
                    </Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="text-gray-300 text-lg">المستخدم</Text>
                    <Text
                        className="text-orange-400 text-xl"
                        style={{
                            fontFamily: fontsLoaded ? "AppFontBold" : "System",
                        }}
                    >
                        {card.usedCredit.toLocaleString()}{" "}
                        <Text className="text-orange-300 text-base">SAR</Text>
                    </Text>
                </View>
            </View>
        ))}
    </View>
)

export default CreditCardSection
