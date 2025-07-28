import React from "react"
import { View, Text } from "react-native"
import InfoCard from "./InfoCard"

const TransactionSection = ({
    userTransactions,
}: {
    userTransactions: any[]
}) => (
    <View>
        {userTransactions.map((transaction, index) => (
            <InfoCard key={index}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text
                        style={{
                            fontSize: 18,
                            color: '#1F2937',
                            fontFamily: "AppFontBold",
                            flex: 1,
                            marginRight: 16,
                            textAlign: 'right'
                        }}
                    >
                        {transaction.merchant}
                    </Text>
                    <Text
                        style={{
                            fontSize: 20,
                            color: transaction.amount > 0 ? '#10B981' : '#EF4444',
                            fontFamily: "AppFontBold",
                        }}
                    >
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount.toLocaleString()}{" "}
                        <Text style={{ fontSize: 16, color: '#6B7280' }}>ر.س</Text>
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#7C3AED', fontFamily: "AppFontRegular" }}>
                        {transaction.category}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6B7280', fontFamily: "AppFontRegular" }}>
                        {transaction.date}
                    </Text>
                </View>
            </InfoCard>
        ))}
    </View>
)

export default TransactionSection
