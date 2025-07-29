import React from "react"
import { View, Text, Pressable } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from "@expo/vector-icons"
import InfoCard from "./InfoCard"

interface Contact {
    name: string
    phone: string
    relationship: string
    accountNumber: string
    lastTransfer?: string
    frequentAmount?: number
}

const ContactsSection = ({ userContacts }: { userContacts: Contact[] }) => {
    const formatAccountNumber = (accountNumber: string) => {
        // Show first 4 and last 4 digits, mask the middle
        if (accountNumber.length < 8) return accountNumber
        const first4 = accountNumber.slice(0, 4)
        const last4 = accountNumber.slice(-4)
        return `${first4}...${last4}`
    }

    const formatAmount = (amount: number) => {
        return amount.toLocaleString("ar-SA")
    }

    return (
        <View>
            {userContacts.map((contact, index) => (
                <InfoCard key={index} style={{ padding: 0 }}>
                    <LinearGradient
                        colors={['#ffffff', '#f8fafc']}
                        style={{
                            borderRadius: 16,
                            padding: 20,
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <View style={{ alignItems: 'flex-start', flex: 1 }}>
                                <View style={{ 
                                    backgroundColor: '#F3F4F6', 
                                    paddingHorizontal: 12, 
                                    paddingVertical: 6, 
                                    borderRadius: 20, 
                                    marginBottom: 8 
                                }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: "#6B7280",
                                            fontFamily: "AppFontRegular",
                                        }}
                                    >
                                        {contact.relationship}
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#6B7280",
                                        fontFamily: "AppFontRegular",
                                        marginBottom: 4,
                                    }}
                                >
                                    {contact.phone}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#6B7280",
                                        fontFamily: "AppFontRegular",
                                    }}
                                >
                                    {formatAccountNumber(contact.accountNumber)}
                                </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        color: "#000000",
                                        fontFamily: "AppFontBold",
                                        textAlign: "right",
                                        marginBottom: 4,
                                    }}
                                >
                                    {contact.name}
                                </Text>
                                {contact.frequentAmount && (
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: "#10B981",
                                            fontFamily: "AppFontBold",
                                        }}
                                    >
                                        {formatAmount(contact.frequentAmount)} ر.س
                                    </Text>
                                )}
                            </View>
                        </View>
                        
                        {contact.lastTransfer && (
                            <View
                                style={{
                                    borderTopWidth: 1,
                                    borderTopColor: "#E5E7EB",
                                    paddingTop: 16,
                                    alignItems: "flex-end",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: "#9CA3AF",
                                        fontFamily: "AppFontRegular",
                                    }}
                                >
                                    آخر تحويل: {contact.lastTransfer}
                                </Text>
                            </View>
                        )}
                    </LinearGradient>
                </InfoCard>
            ))}
        </View>
    )
}

export default ContactsSection