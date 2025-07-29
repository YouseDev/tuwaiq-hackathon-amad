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
            borderRadius: 16,
            padding: 24,
            margin: 16,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
        }}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#3B82F6',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12
                }}>
                    <Feather name="credit-card" size={24} color="#ffffff" />
                </View>
                <Text style={{
                    fontSize: 24,
                    color: '#1F2937',
                    fontFamily: 'AppFontBold',
                    textAlign: 'center'
                }}>
                    تأكيد دفع الفواتير
                </Text>
            </View>

            {/* Bills List */}
            <View style={{ marginBottom: 20 }}>
                {data.matched_bills.map((bill, index) => (
                    <View key={bill.id} style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 12,
                        borderBottomWidth: index < data.matched_bills.length - 1 ? 1 : 0,
                        borderBottomColor: '#F3F4F6'
                    }}>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={{
                                fontSize: 18,
                                color: '#1F2937',
                                fontFamily: 'AppFontBold',
                                textAlign: 'right'
                            }}>
                                {bill.provider}
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: '#6B7280',
                                fontFamily: 'AppFontRegular',
                                textAlign: 'right',
                                marginTop: 2
                            }}>
                                تاريخ الاستحقاق: {formatDate(bill.dueDate)}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-start', marginLeft: 16 }}>
                            <Text style={{
                                fontSize: 18,
                                color: '#DC2626',
                                fontFamily: 'AppFontBold'
                            }}>
                                {formatAmount(bill.amount)}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Total */}
            <View style={{
                backgroundColor: '#F3F4F6',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 20,
                        color: '#1F2937',
                        fontFamily: 'AppFontBold'
                    }}>
                        المجموع الكلي
                    </Text>
                    <Text style={{
                        fontSize: 24,
                        color: '#DC2626',
                        fontFamily: 'AppFontBold'
                    }}>
                        {formatAmount(data.total_amount)}
                    </Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={{
                flexDirection: 'row',
                gap: 12
            }}>
                <Pressable
                    onPress={onCancel}
                    style={{
                        flex: 1,
                        backgroundColor: '#F3F4F6',
                        borderRadius: 12,
                        paddingVertical: 16,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Text style={{
                        fontSize: 18,
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
                        borderRadius: 12,
                        paddingVertical: 16,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Text style={{
                        fontSize: 18,
                        color: '#ffffff',
                        fontFamily: 'AppFontBold'
                    }}>
                        تأكيد الدفع
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}