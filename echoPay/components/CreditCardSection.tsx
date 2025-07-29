import React from "react"
import { View, Text } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import InfoCard from "./InfoCard"

const CreditCardSection = ({ userCards }: { userCards: any[] }) => (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <Text
            style={{
                fontSize: 28,
                color: '#000000',
                fontFamily: "AppFontBold",
                textAlign: 'right',
                marginBottom: 24
            }}
        >
            البطاقات
        </Text>
        {userCards.map((card) => (
            <InfoCard key={card.id} style={{ padding: 0 }}>
                <LinearGradient
                    colors={['#ffffff', '#f8fafc']}
                    style={{
                        borderRadius: 16,
                        padding: 20,
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Text style={{ 
                            fontSize: 16, 
                            color: '#6B7280', 
                            fontFamily: "AppFontRegular"
                        }}>
                            •••• {card.cardNumber}
                        </Text>
                        <Text
                            style={{
                                fontSize: 20,
                                color: '#000000',
                                fontFamily: "AppFontBold",
                                textAlign: 'right'
                            }}
                        >
                            {card.cardType}
                        </Text>
                    </View>
                    {/* Show different info for mada vs credit cards */}
                    {card.cardType === "مدى" ? (
                        // Mada card shows account balance
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: '#10B981',
                                    fontFamily: "AppFontBold",
                                }}
                            >
                                {card.availableCredit.toLocaleString()}{" "}
                                <Text style={{ fontSize: 16, color: '#000000' }}>ر.س</Text>
                            </Text>
                            <Text style={{ fontSize: 18, color: '#000000', fontFamily: "AppFontRegular" }}>الرصيد المتاح</Text>
                        </View>
                    ) : (
                        // Credit cards show limit and used amount
                        <>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        color: '#10B981',
                                        fontFamily: "AppFontBold",
                                    }}
                                >
                                    {card.availableCredit.toLocaleString()}{" "}
                                    <Text style={{ fontSize: 16, color: '#000000' }}>ر.س</Text>
                                </Text>
                                <Text style={{ fontSize: 18, color: '#000000', fontFamily: "AppFontRegular" }}>الحد المتاح</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        color: '#DC2626',
                                        fontFamily: "AppFontBold",
                                    }}
                                >
                                    {card.usedCredit.toLocaleString()}{" "}
                                    <Text style={{ fontSize: 16, color: '#000000' }}>ر.س</Text>
                                </Text>
                                <Text style={{ fontSize: 18, color: '#000000', fontFamily: "AppFontRegular" }}>المستخدم</Text>
                            </View>
                        </>
                    )}
                </LinearGradient>
            </InfoCard>
        ))}
    </View>
)

export default CreditCardSection
