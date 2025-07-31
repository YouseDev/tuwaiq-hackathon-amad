import React from "react"
import { View, Text } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from "@expo/vector-icons"
import InfoCard from "./InfoCard"
import { useCards } from "../context/CardContext"
import { CreditCard } from "../types/core"

const CreditCardSection = () => {
    const { cards } = useCards()
    
    return (
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
        {cards.map((card) => (
            <InfoCard key={card.id} style={{ padding: 0 }}>
                <LinearGradient
                    colors={card.isLocked ? ['#f3f4f6', '#e5e7eb'] : ['#ffffff', '#f8fafc']}
                    style={{
                        borderRadius: 16,
                        padding: 20,
                        opacity: card.isLocked ? 0.7 : 1,
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ 
                                fontSize: 16, 
                                color: '#6B7280', 
                                fontFamily: "AppFontRegular"
                            }}>
                                •••• {card.cardNumber}
                            </Text>
                            {card.isLocked && (
                                <Feather name="lock" size={16} color="#DC2626" style={{ marginLeft: 8 }} />
                            )}
                        </View>
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
                    {/* Show credit info only for credit cards (not mada) */}
                    {card.cardType !== "مدى" && (
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
                    
                    {/* Card Security Status */}
                    <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Feather 
                                    name={card.isLocked ? "lock" : "unlock"} 
                                    size={18} 
                                    color={card.isLocked ? "#DC2626" : "#10B981"} 
                                />
                                <Text style={{ 
                                    fontSize: 16, 
                                    color: card.isLocked ? "#DC2626" : "#10B981", 
                                    fontFamily: "AppFontRegular",
                                    marginLeft: 8
                                }}>
                                    {card.isLocked ? 'مقفلة' : 'نشطة'}
                                </Text>
                            </View>
                            <Text style={{ fontSize: 16, color: '#000000', fontFamily: "AppFontRegular" }}>
                                حالة البطاقة
                            </Text>
                        </View>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Feather 
                                    name="globe" 
                                    size={18} 
                                    color={card.internetPurchasesEnabled ? "#10B981" : "#DC2626"} 
                                />
                                <Text style={{ 
                                    fontSize: 16, 
                                    color: card.internetPurchasesEnabled ? "#10B981" : "#DC2626", 
                                    fontFamily: "AppFontRegular",
                                    marginLeft: 8
                                }}>
                                    {card.internetPurchasesEnabled ? 'مفعل' : 'معطل'}
                                </Text>
                            </View>
                            <Text style={{ fontSize: 16, color: '#000000', fontFamily: "AppFontRegular" }}>
                                الشراء الالكتروني
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </InfoCard>
        ))}
    </View>
    )
}

export default CreditCardSection
