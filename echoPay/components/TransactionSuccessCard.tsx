import React from "react"
import { View, Text, Pressable } from "react-native"
import { Feather } from "@expo/vector-icons"
import { Bill } from "../types/core"

interface TransactionData {
    id?: string
    type?: "bill" | "transfer"
    transactionId?: string
    paidBills?: Bill[]
    totalAmount?: number
    amount?: number
    recipient?: string
    sourceAccount?: string
    paymentSource?: string
    timestamp?: string
    message?: string
    updatedBalances?: {
        checking: number
        savings: number
    }
}

interface TransactionSuccessCardProps {
    data: TransactionData
    onDismiss: () => void
}

export default function TransactionSuccessCard({ data, onDismiss }: TransactionSuccessCardProps) {
    const formatAmount = (amount: number): string => {
        return `${amount} ر.س`
    }

    const formatDate = (dateString?: string): string => {
        const date = dateString ? new Date(dateString) : new Date()
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
        return date.toLocaleDateString('ar-SA', options)
    }

    const getPaymentSourceName = (source?: string): string => {
        return source === "checking" ? "الحساب الجاري" : "حساب التوفير"
    }

    const isTransfer = data.type === "transfer"
    const amount = data.amount || data.totalAmount || 0
    const transactionId = data.id || data.transactionId || `TXN${Date.now()}`

    return (
        <Pressable onPress={onDismiss} style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            padding: 16,
            margin: 8,
            borderWidth: 2,
            borderColor: '#10B981',
            shadowColor: '#10B981',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 8,
        }}>
            {/* Success Header */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: '#10B981',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12
                }}>
                    <Feather name="check" size={32} color="#ffffff" />
                </View>
                <Text style={{
                    fontSize: 24,
                    color: '#10B981',
                    fontFamily: 'AppFontBold',
                    textAlign: 'center'
                }}>
                    {isTransfer ? "تم التحويل بنجاح" : "تمت العملية بنجاح"}
                </Text>
                {data.message && (
                    <Text style={{
                        fontSize: 16,
                        color: '#6B7280',
                        fontFamily: 'AppFontRegular',
                        textAlign: 'center',
                        marginTop: 8
                    }}>
                        {data.message}
                    </Text>
                )}
            </View>

            {/* Transaction Details */}
            <View style={{
                backgroundColor: '#F0FDF4',
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#BBF7D0'
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#15803D',
                        fontFamily: 'AppFontRegular'
                    }}>
                        رقم العملية
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        color: '#15803D',
                        fontFamily: 'AppFontBold'
                    }}>
                        {transactionId}
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: isTransfer ? 12 : 0
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#15803D',
                        fontFamily: 'AppFontRegular'
                    }}>
                        تاريخ العملية
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        color: '#15803D',
                        fontFamily: 'AppFontRegular'
                    }}>
                        {formatDate(data.timestamp)}
                    </Text>
                </View>

                {isTransfer && data.recipient && (
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: '#15803D',
                            fontFamily: 'AppFontRegular'
                        }}>
                            المستلم
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: '#15803D',
                            fontFamily: 'AppFontBold'
                        }}>
                            {data.recipient}
                        </Text>
                    </View>
                )}
            </View>

            {/* Bills Section (for bill payments only) */}
            {!isTransfer && data.paidBills && data.paidBills.length > 0 && (
                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 18,
                        color: '#15803D',
                        fontFamily: 'AppFontBold',
                        textAlign: 'right',
                        marginBottom: 12
                    }}>
                        الفواتير المدفوعة
                    </Text>
                    
                    {data.paidBills?.map((bill, index) => (
                        <View key={bill.id} style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingVertical: 8,
                            borderBottomWidth: index < (data.paidBills?.length || 0) - 1 ? 1 : 0,
                            borderBottomColor: '#BBF7D0'
                        }}>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#15803D',
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
            )}

            {/* Total Amount */}
            <View style={{
                backgroundColor: '#10B981',
                borderRadius: 12,
                padding: 16
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
                        {isTransfer ? "المبلغ المحول" : "المبلغ الإجمالي"}
                    </Text>
                    <Text style={{
                        fontSize: 24,
                        color: '#ffffff',
                        fontFamily: 'AppFontBold'
                    }}>
                        {formatAmount(amount)}
                    </Text>
                </View>
            </View>
        </Pressable>
    )
}