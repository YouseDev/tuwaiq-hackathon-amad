import React, { useState } from "react"
import { ScrollView, View, Text } from "react-native"
import BillsSection from "../../components/BillsSection"
import bankingData from "../../assets/data/banking_data.json"

export default function BillsScreen() {
    /* -------- Demo banking data -------- */
    const [userBills] = useState(bankingData.bills)

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