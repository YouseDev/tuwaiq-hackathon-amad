import React, { useState } from "react"
import { ScrollView, View, Text } from "react-native"
import TransactionSection from "../../components/TransactionSection"
import bankingData from "../../assets/data/banking_data.json"

export default function TransactionsScreen() {
    /* -------- Demo banking data -------- */
    const [userTransactions] = useState(bankingData.transactions.january_2024)

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
                        العمليات
                    </Text>
                    <Text
                        className="text-gray-600 text-lg text-right mt-2"
                        style={{
                            fontFamily: "AppFontRegular",
                        }}
                    >
                        تاريخ المعاملات المالية
                    </Text>
                </View>

                {/* Transactions Section */}
                <View className="px-6">
                    <TransactionSection userTransactions={userTransactions} />
                </View>
            </ScrollView>
        </View>
    )
}