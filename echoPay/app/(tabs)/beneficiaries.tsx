import React, { useState } from "react"
import { ScrollView, View, Text } from "react-native"
import ContactsSection from "../../components/ContactsSection"
import VoiceButton from "../../components/VoiceButton"
import bankingData from "../../assets/data/banking_data.json"

export default function BeneficiariesScreen() {
    /* -------- Demo banking data -------- */
    const [userContacts] = useState(bankingData.contacts)

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
                        المستفيدين
                    </Text>
                    <Text
                        className="text-gray-600 text-lg text-right mt-2"
                        style={{
                            fontFamily: "AppFontRegular",
                        }}
                    >
                        إدارة جهات الاتصال والتحويلات
                    </Text>
                </View>

                {/* Statistics Cards */}
                <View style={{ flexDirection: 'row', paddingHorizontal: 24, marginBottom: 24, gap: 12 }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: '#ffffff',
                        borderRadius: 16,
                        padding: 16,
                        alignItems: 'center',
                        shadowColor: "#000000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                    }}>
                        <Text style={{
                            fontSize: 24,
                            color: '#1F2937',
                            fontFamily: "AppFontBold",
                            marginBottom: 4,
                        }}>
                            {userContacts.length}
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: '#6B7280',
                            fontFamily: "AppFontRegular",
                            textAlign: 'center',
                        }}>
                            إجمالي المستفيدين
                        </Text>
                    </View>
                    
                    <View style={{
                        flex: 1,
                        backgroundColor: '#ffffff',
                        borderRadius: 16,
                        padding: 16,
                        alignItems: 'center',
                        shadowColor: "#000000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                    }}>
                        <Text style={{
                            fontSize: 24,
                            color: '#10B981',
                            fontFamily: "AppFontBold",
                            marginBottom: 4,
                        }}>
                            {userContacts.filter(contact => contact.lastTransfer).length}
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: '#6B7280',
                            fontFamily: "AppFontRegular",
                            textAlign: 'center',
                        }}>
                            تحويلات نشطة
                        </Text>
                    </View>
                </View>

                {/* Contacts Section */}
                <View className="px-6">
                    <ContactsSection userContacts={userContacts} />
                </View>
            </ScrollView>

            {/* Voice Assistant FAB */}
            <VoiceButton />
        </View>
    )
}