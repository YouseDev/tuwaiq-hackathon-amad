import React from "react"
import { View, Text } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import InfoCard from "./InfoCard"

const BalanceSection = ({ userAccount }: { userAccount: any }) => (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <InfoCard style={{ padding: 0 }}>
            <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={{
                    borderRadius: 16,
                    padding: 24,
                }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <Text
                        style={{
                            fontSize: 32,
                            color: '#10B981',
                            fontFamily: "AppFontBold",
                        }}
                    >
                        {userAccount.checking.balance.toLocaleString()}{" "}
                        <Text style={{ fontSize: 18, color: '#000000' }}>ر.س</Text>
                    </Text>
                    <Text
                        style={{
                            fontSize: 20,
                            color: '#000000',
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
                            color: '#10B981',
                            fontFamily: "AppFontBold",
                        }}
                    >
                        {userAccount.savings.balance.toLocaleString()}{" "}
                        <Text style={{ fontSize: 18, color: '#000000' }}>ر.س</Text>
                    </Text>
                    <Text
                        style={{
                            fontSize: 20,
                            color: '#000000',
                            fontFamily: "AppFontRegular",
                        }}
                    >
                        حساب التوفير
                    </Text>
                </View>
            </LinearGradient>
        </InfoCard>
    </View>
)

export default BalanceSection
