import React from "react"
import { View, Text, Pressable } from "react-native"
import { Feather } from "@expo/vector-icons"
import { Bill } from "../types/core"

interface TransactionData {
    transactionId: string
    paidBills: Bill[]
    totalAmount: number
    paymentSource: string
    timestamp: string
}

interface TransactionSuccessCardProps {
    data: TransactionData
    onDismiss: () => void
}

export default function TransactionSuccessCard({ data, onDismiss }: TransactionSuccessCardProps) {
    const formatAmount = (amount: number): string => {
        return `${amount.toFixed(2)} ريال`
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
        return date.toLocaleDateString('ar-SA', options)
    }

    const getPaymentSourceName = (source: string): string => {
        return source === "checking" ? "الحساب الجاري" : "حساب التوفير"
    }

    return (
        <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 24,
            margin: 16,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
        }}>
            {/* Success Header */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <View style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: '#10B981',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16
                }}>
                    <Feather name="check" size={32} color="#ffffff" />
                </View>
                <Text style={{
                    fontSize: 28,
                    color: '#10B981',
                    fontFamily: 'AppFontBold',
                    textAlign: 'center',
                    marginBottom: 8
                }}>
                    تمت العملية بنجاح
                </Text>
                <Text style={{
                    fontSize: 16,
                    color: '#6B7280',
                    fontFamily: 'AppFontRegular',
                    textAlign: 'center'
                }}>
                    تم دفع فواتيرك بنجاح
                </Text>
            </View>

            {/* Transaction Details */}
            <View style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 16,
                padding: 20,
                marginBottom: 20
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#6B7280',
                        fontFamily: 'AppFontRegular'
                    }}>
                        رقم العملية
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        color: '#1F2937',
                        fontFamily: 'AppFontBold'
                    }}>
                        {data.transactionId}
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#6B7280',
                        fontFamily: 'AppFontRegular'
                    }}>
                        تاريخ العملية
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        color: '#1F2937',
                        fontFamily: 'AppFontRegular'
                    }}>
                        {formatDate(data.timestamp)}
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#6B7280',
                        fontFamily: 'AppFontRegular'
                    }}>
                        مصدر الدفع
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        color: '#1F2937',
                        fontFamily: 'AppFontRegular'
                    }}>
                        {getPaymentSourceName(data.paymentSource)}
                    </Text>
                </View>
            </View>

            {/* Paid Bills */}
            <View style={{ marginBottom: 20 }}>
                <Text style={{
                    fontSize: 18,
                    color: '#1F2937',
                    fontFamily: 'AppFontBold',
                    textAlign: 'right',
                    marginBottom: 12
                }}>
                    الفواتير المدفوعة
                </Text>
                
                {data.paidBills.map((bill, index) => (
                    <View key={bill.id} style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 8,
                        borderBottomWidth: index < data.paidBills.length - 1 ? 1 : 0,
                        borderBottomColor: '#F3F4F6'
                    }}>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#1F2937',
                                fontFamily: 'AppFontBold',
                                textAlign: 'right'
                            }}>
                                {bill.provider}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-start', marginLeft: 16 }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#10B981',
                                fontFamily: 'AppFontBold'
                            }}>
                                {formatAmount(bill.amount)}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Total Amount */}
            <View style={{
                backgroundColor: '#10B981',
                borderRadius: 16,
                padding: 20,
                marginBottom: 24
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 20,
                        color: '#ffffff',
                        fontFamily: 'AppFontBold'
                    }}>
                        المبلغ الإجمالي
                    </Text>
                    <Text style={{
                        fontSize: 24,
                        color: '#ffffff',
                        fontFamily: 'AppFontBold'
                    }}>
                        {formatAmount(data.totalAmount)}
                    </Text>
                </View>
            </View>

            {/* Done Button */}
            <Pressable
                onPress={onDismiss}
                style={{
                    backgroundColor: '#3B82F6',
                    borderRadius: 16,
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
                    تم
                </Text>
            </Pressable>
        </View>
    )
}