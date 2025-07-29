import React from "react"
import { View, Text } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import InfoCard from "./InfoCard"

const BillsSection = ({ userBills }: { userBills: any[] }) => (
    <View>
        {userBills.map((bill) => (
            <InfoCard key={bill.id} style={{ padding: 0 }}>
                <LinearGradient
                    colors={['#ffffff', '#f8fafc']}
                    style={{
                        borderRadius: 16,
                        padding: 20,
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: bill.status === "مستحقة" ? "#EF4444" : "#10B981",
                                    fontFamily: "AppFontBold",
                                    marginBottom: 4,
                                }}
                            >
                                {bill.amount.toLocaleString()}{" "}
                                <Text style={{ fontSize: 14, color: "#000000" }}>ر.س</Text>
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: bill.status === "مستحقة" ? "#EF4444" : bill.status === "مستحقة قريباً" ? "#F59E0B" : "#10B981",
                                }}
                            >
                                {bill.status}
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 20,
                                color: "#000000",
                                fontFamily: "AppFontBold",
                                textAlign: "right",
                            }}
                        >
                            {bill.provider}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                color: "#000000",
                                fontFamily: "AppFontRegular",
                            }}
                        >
                            {bill.type}
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: "#6B7280",
                                fontFamily: "AppFontRegular",
                            }}
                        >
                            استحقاق: {bill.dueDate}
                        </Text>
                    </View>
                </LinearGradient>
            </InfoCard>
        ))}
    </View>
)

export default BillsSection
