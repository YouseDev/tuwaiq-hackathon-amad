import React, { useState } from "react"
import { ScrollView, View, Text } from "react-native"
import BalanceSection from "../../components/BalanceSection"
import CreditCardSection from "../../components/CreditCardSection"
import VoiceButton from "../../components/VoiceButton"
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
            <VoiceButton />
        </View>
    )
}
