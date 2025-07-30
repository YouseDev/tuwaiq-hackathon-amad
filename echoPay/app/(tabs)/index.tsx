import React, { useState } from "react"
import { ScrollView, View, Text, Pressable } from "react-native"
import { router } from "expo-router"
import { Feather } from "@expo/vector-icons"
import { LinearGradient } from 'expo-linear-gradient'
import BalanceSection from "../../components/BalanceSection"
import CreditCardSection from "../../components/CreditCardSection"
import { useAccounts } from "../../context/AccountContext"
import bankingData from "../../assets/data/banking_data.json"

export default function AccountsScreen() {
    /* -------- Dynamic account data -------- */
    const { accounts: userAccount } = useAccounts()

    /* -------- UI -------- */
    return (
        <View style={{ flex: 1, backgroundColor: '#f9eeea', paddingTop: 64 }}>
            <ScrollView
                className="flex-1 w-full px-0 py-6"
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Header */}
                <View className="w-full px-6 mb-8">
                    <Text
                        style={{
                            fontSize: 36,
                            color: '#000000',
                            fontFamily: "AppFontBold",
                            textAlign: 'right'
                        }}
                    >
                        مساء الخير ، أحمد
                    </Text>
                </View>

                {/* Sections */}
                <BalanceSection userAccount={userAccount} />
                <CreditCardSection />
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
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                }}
            >
                <LinearGradient
                    colors={['#1F2937', '#374151']}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Feather name="mic" size={24} color="#fff" />
                </LinearGradient>
            </Pressable>
        </View>
    )
}
