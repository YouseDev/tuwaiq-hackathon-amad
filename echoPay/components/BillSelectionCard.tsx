import React from "react"
import { View, Text, Pressable } from "react-native"
import { Feather } from "@expo/vector-icons"
import { Bill, BillSelectionData } from "../types/core"

interface BillSelectionCardProps {
    data: BillSelectionData
    onConfirm: () => void
    onCancel: () => void
}

export default function BillSelectionCard({
    data,
    onConfirm,
    onCancel,
}: BillSelectionCardProps) {
    const formatAmount = (amount: number): string => {
        // Convert numbers to Arabic words - simplified version
        return `${amount} ريال`
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        return date.toLocaleDateString("ar-SA")
    }

    // Add safety checks for data
    if (!data) {
        console.error("❌ BillSelectionCard: data is undefined")
        return null
    }

    if (!data.matched_bills || !Array.isArray(data.matched_bills)) {
        console.error(
            "❌ BillSelectionCard: matched_bills is undefined or not an array",
            data,
        )
        return null
    }

    return (
        <View
            style={{
                backgroundColor: "#ffffff",
                borderRadius: 12,
                padding: 12,
                margin: 8,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 3,
            }}
        >
            {/* Header */}
            <View
                style={{
                    marginBottom: 12,
                    paddingBottom: 10,
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "#E5E7EB",
                }}
            >
                <Text
                    style={{
                        fontSize: 24,
                        color: "#1F2937",
                        fontFamily: "AppFontBold",
                        textAlign: "center",
                    }}
                >
                    تأكيد دفع الفواتير
                </Text>
            </View>

            {/* Compact Bills List */}
            <View style={{ marginBottom: 8 }}>
                {data.matched_bills.map((bill, index) => (
                    <View
                        key={bill.id}
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 6,
                            borderBottomWidth:
                                index < data.matched_bills.length - 1 ? 1 : 0,
                            borderBottomColor: "#F3F4F6",
                        }}
                    >
                        <View style={{ flex: 1, paddingRight: 12 }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: "#000000",
                                    fontFamily: "AppFontBold",
                                    textAlign: "right",
                                }}
                            >
                                {bill.provider}
                            </Text>
                        </View>
                        <View style={{ alignItems: "flex-start" }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: "#DC2626",
                                    fontFamily: "AppFontBold",
                                }}
                            >
                                {bill.amount} ر.س
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Compact Total */}
            <View
                style={{
                    backgroundColor: "#F8F9FA",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 8,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        direction: "rtl",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: "#000000",
                            fontFamily: "AppFontBold",
                            textAlign: "right",
                        }}
                    >
                        المجموع
                    </Text>
                    <Text
                        style={{
                            fontSize: 18,
                            color: "#DC2626",
                            fontFamily: "AppFontBold",
                        }}
                    >
                        {data.total_amount} ر.س
                    </Text>
                </View>
            </View>

            {/* Voice-only app - no buttons needed */}
        </View>
    )
}
