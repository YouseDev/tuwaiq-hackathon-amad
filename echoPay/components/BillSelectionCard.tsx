import React from "react"
import { View, Text, Pressable } from "react-native"
import { Feather } from "@expo/vector-icons"
import { Bill, BillSelectionData } from "../types/core"

interface BillSelectionCardProps {
    data: BillSelectionData
    onConfirm: () => void
    onCancel: () => void
}

export default function BillSelectionCard({ data, onConfirm, onCancel }: BillSelectionCardProps) {
    const formatAmount = (amount: number): string => {
        // Convert numbers to Arabic words - simplified version
        return `${amount} ريال`
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ar-SA')
    }

    return (
        <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 12,
            margin: 8,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
        }}>
            {/* Compact Bills List */}
            <View style={{ marginBottom: 8 }}>
                {data.matched_bills.map((bill, index) => (
                    <View key={bill.id} style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 6,
                        borderBottomWidth: index < data.matched_bills.length - 1 ? 1 : 0,
                        borderBottomColor: '#F3F4F6'
                    }}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#000000',
                                fontFamily: 'AppFontBold',
                                textAlign: 'right'
                            }}>
                                {bill.provider}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#DC2626',
                                fontFamily: 'AppFontBold'
                            }}>
                                {bill.amount} ر.س
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Compact Total */}
            <View style={{
                backgroundColor: '#F8F9FA',
                borderRadius: 8,
                padding: 10,
                marginBottom: 8
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 16,
                        color: '#000000',
                        fontFamily: 'AppFontBold',
                        textAlign: 'right'
                    }}>
                        المجموع
                    </Text>
                    <Text style={{
                        fontSize: 18,
                        color: '#DC2626',
                        fontFamily: 'AppFontBold'
                    }}>
                        {data.total_amount} ر.س
                    </Text>
                </View>
            </View>

            {/* Compact Action Buttons */}
            <View style={{
                flexDirection: 'row',
                gap: 8
            }}>
                <Pressable
                    onPress={onCancel}
                    style={{
                        flex: 1,
                        backgroundColor: '#F3F4F6',
                        borderRadius: 8,
                        paddingVertical: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Text style={{
                        fontSize: 16,
                        color: '#6B7280',
                        fontFamily: 'AppFontBold'
                    }}>
                        إلغاء
                    </Text>
                </Pressable>

                <Pressable
                    onPress={onConfirm}
                    style={{
                        flex: 1,
                        backgroundColor: '#3B82F6',
                        borderRadius: 8,
                        paddingVertical: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Text style={{
                        fontSize: 16,
                        color: '#ffffff',
                        fontFamily: 'AppFontBold'
                    }}>
                        تأكيد
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}