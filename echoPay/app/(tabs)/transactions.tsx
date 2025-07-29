import React from "react"
import { ScrollView, View, Text } from "react-native"
import TransactionSection from "../../components/TransactionSection"
import { useTransactions } from "../../context/TransactionContext"

export default function TransactionsScreen() {
    /* -------- Dynamic transaction data -------- */
    const { transactions: userTransactions } = useTransactions()

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