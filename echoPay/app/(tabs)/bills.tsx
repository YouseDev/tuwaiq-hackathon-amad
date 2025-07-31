import React from "react"
import { ScrollView, View, Text } from "react-native"
import BillsSection from "../../components/BillsSection"
import { useBills } from "../../context/BillsContext"

export default function BillsScreen() {
    /* -------- Bills from context -------- */
    const { bills: userBills } = useBills()

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