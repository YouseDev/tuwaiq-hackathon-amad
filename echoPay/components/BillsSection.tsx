import React from "react"
import { View, Text } from "react-native"
import InfoCard from "./InfoCard"

const BillsSection = ({ userBills }: { userBills: any[] }) => (
    <View>
        {userBills.map((bill) => (
            <InfoCard key={bill.id}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            color: "#1F2937",
                            fontFamily: "AppFontBold",
                            flex: 1,
                            textAlign: "right",
                        }}
                    >
                        {bill.provider}
                    </Text>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text
                            style={{
                                fontSize: 20,
                                color:
                                    bill.status === "مستحقة"
                                        ? "#EF4444"
                                        : "#7C3AED",
                                fontFamily: "AppFontBold",
                            }}
                        >
                            {bill.amount.toLocaleString()}{" "}
                            <Text style={{ fontSize: 16, color: "#6B7280" }}>
                                SAR
                            </Text>
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color:
                                    bill.status === "مستحقة"
                                        ? "#EF4444"
                                        : bill.status === "مستحقة قريباً"
                                          ? "#F59E0B"
                                          : "#10B981",
                                marginTop: 4,
                            }}
                        >
                            {bill.status}
                        </Text>
                    </View>
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
                            color: "#7C3AED",
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
            </InfoCard>
        ))}
    </View>
)

export default BillsSection
