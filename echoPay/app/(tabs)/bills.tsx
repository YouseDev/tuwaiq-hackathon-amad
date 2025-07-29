import React, { useState } from "react"
import { ScrollView, View, Text } from "react-native"
import BillsSection from "../../components/BillsSection"
import bankingData from "../../assets/data/banking_data.json"

export default function BillsScreen() {
    /* -------- Demo banking data -------- */
    const [userBills] = useState(bankingData.bills)

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
                        الفواتير
                    </Text>
                    <Text
                        className="text-gray-600 text-lg text-right mt-2"
                        style={{
                            fontFamily: "AppFontRegular",
                        }}
                    >
                        إدارة فواتيرك المستحقة
                    </Text>
                </View>

                {/* Bills Section */}
                <View className="px-6">
                    <BillsSection userBills={userBills} />
                </View>
            </ScrollView>
        </View>
    )
}