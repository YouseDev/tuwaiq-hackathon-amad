import React from "react"
import { View, Text } from "react-native"
import InfoCard from "./InfoCard"

const CreditCardSection = ({ userCards }: { userCards: any[] }) => (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <Text
            style={{
                fontSize: 28,
                color: '#1F2937',
                fontFamily: "AppFontBold",
                textAlign: 'right',
                marginBottom: 24
            }}
        >
            البطاقات
        </Text>
        {userCards.map((card) => (
            <InfoCard key={card.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <Text
                        style={{
                            fontSize: 18,
                            color: '#1F2937',
                            fontFamily: "AppFontBold",
                            flex: 1,
                            textAlign: 'right'
                        }}
                    >
                        {card.cardType}
                    </Text>
                    <Text style={{ fontSize: 16, color: '#6B7280', fontFamily: "AppFontRegular" }}>
                        {card.cardNumber}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text
                        style={{
                            fontSize: 20,
                            color: '#10B981',
                            fontFamily: "AppFontBold",
                        }}
                    >
                        {card.availableCredit.toLocaleString()}{" "}
                        <Text style={{ fontSize: 16, color: '#6B7280' }}>SAR</Text>
                    </Text>
                    <Text style={{ fontSize: 18, color: '#6B7280', fontFamily: "AppFontRegular" }}>الحد المتاح</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text
                        style={{
                            fontSize: 20,
                            color: '#7C3AED',
                            fontFamily: "AppFontBold",
                        }}
                    >
                        {card.usedCredit.toLocaleString()}{" "}
                        <Text style={{ fontSize: 16, color: '#6B7280' }}>SAR</Text>
                    </Text>
                    <Text style={{ fontSize: 18, color: '#6B7280', fontFamily: "AppFontRegular" }}>المستخدم</Text>
                </View>
            </InfoCard>
        ))}
    </View>
)

export default CreditCardSection
