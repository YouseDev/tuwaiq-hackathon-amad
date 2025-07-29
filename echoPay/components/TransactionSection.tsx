import React from "react"
import { View, Text } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import InfoCard from "./InfoCard"

const TransactionSection = ({
    userTransactions,
}: {
    userTransactions: any[]
}) => (
    <View>
        {userTransactions.map((transaction, index) => (
            <InfoCard key={index} style={{ padding: 0 }}>
                <LinearGradient
                    colors={['#ffffff', '#f8fafc']}
                    style={{
                        borderRadius: 16,
                        padding: 20,
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <Text
                            style={{
                                fontSize: 18,
                                color: transaction.amount > 0 ? '#10B981' : '#EF4444',
                                fontFamily: "AppFontBold",
                            }}
                        >
                            {transaction.amount > 0 ? "+" : ""}
                            {transaction.amount.toLocaleString()}{" "}
                            <Text style={{ fontSize: 14, color: '#000000' }}>ر.س</Text>
                        </Text>
                        <Text
                            style={{
                                fontSize: 18,
                                color: '#000000',
                                fontFamily: "AppFontBold",
                                textAlign: 'right',
                            }}
                        >
                            {transaction.merchant || transaction.description}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#000000', fontFamily: "AppFontRegular" }}>
                            {transaction.category}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#6B7280', fontFamily: "AppFontRegular" }}>
                            {transaction.date}
                        </Text>
                    </View>
                </LinearGradient>
            </InfoCard>
        ))}
    </View>
)

export default TransactionSection
