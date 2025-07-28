import React, { useState } from "react"
import { ScrollView, View, Text, Pressable } from "react-native"
import { router } from "expo-router"
import { Feather } from "@expo/vector-icons"
import BalanceSection from "../../components/BalanceSection"
import CreditCardSection from "../../components/CreditCardSection"
import bankingData from "../../assets/data/banking_data.json"

export default function AccountsScreen() {
    /* -------- Demo banking data -------- */
    const [userAccount] = useState(bankingData.accounts)
    const [userCards] = useState(bankingData.creditCards)

    /* -------- UI -------- */
    return (
        <View className="flex-1 bg-white pt-16">
            <ScrollView
                className="flex-1 w-full px-0 py-6"
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Header */}
                <View className="w-full px-6 mb-8">
                    <Text
                        className="text-gray-800 text-4xl text-right"
                        style={{
                            fontFamily: "AppFontBold",
                        }}
                    >
                        مساء الخير ، أحمد
                    </Text>
                </View>

                {/* Sections */}
                <BalanceSection userAccount={userAccount} />
                <CreditCardSection userCards={userCards} />
            </ScrollView>

            {/* Voice Assistant FAB */}
            <Pressable
                onPress={() => router.push("/assistant")}
                style={{
                    position: "absolute",
                    bottom: 30,
                    right: 30,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: "#7C3AED",
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "#7C3AED",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                }}
            >
                <Feather name="mic" size={24} color="#fff" />
            </Pressable>
        </View>
    )
}
