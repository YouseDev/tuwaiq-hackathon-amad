import React from "react"
import { View, Text } from "react-native"
import InfoCard from "./InfoCard"

const BalanceSection = ({ userAccount }: { userAccount: any }) => (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <InfoCard style={{ backgroundColor: '#FAF5FF', borderColor: '#E9D5FF' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <Text
                    style={{
                        fontSize: 32,
                        color: '#1F2937',
                        fontFamily: "AppFontBold",
                    }}
                >
                    {userAccount.checking.balance.toLocaleString()}{" "}
                    <Text style={{ fontSize: 18, color: '#7C3AED' }}>SAR</Text>
                </Text>
                <Text
                    style={{
                        fontSize: 20,
                        color: '#6B7280',
                        fontFamily: "AppFontRegular",
                    }}
                >
                    الحساب الجاري
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text
                    style={{
                        fontSize: 32,
                        color: '#1F2937',
                        fontFamily: "AppFontBold",
                    }}
                >
                    {userAccount.savings.balance.toLocaleString()}{" "}
                    <Text style={{ fontSize: 18, color: '#7C3AED' }}>SAR</Text>
                </Text>
                <Text
                    style={{
                        fontSize: 20,
                        color: '#6B7280',
                        fontFamily: "AppFontRegular",
                    }}
                >
                    حساب التوفير
                </Text>
            </View>
        </InfoCard>
    </View>
)

export default BalanceSection
