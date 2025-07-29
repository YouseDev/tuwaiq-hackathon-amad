import React from "react"
import { View, Text, Pressable } from "react-native"
import { TransferSelectionData } from "../types/core"

interface TransferSelectionCardProps {
    transferData: TransferSelectionData
    onConfirm: () => void
    onCancel: () => void
}

const TransferSelectionCard: React.FC<TransferSelectionCardProps> = ({
    transferData,
    onConfirm,
    onCancel,
}) => {
    const formatAmount = (amount: number) => {
        return `${amount} ريال`
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
            {/* Compact Transfer Info */}
            <View style={{ marginBottom: 8 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 6,
                }}>
                    <View style={{ flex: 1, paddingRight: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            color: '#000000',
                            fontFamily: 'AppFontBold',
                            textAlign: 'right'
                        }}>
                            {transferData.recipient.name}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            color: '#6B7280',
                            fontFamily: 'AppFontRegular',
                            textAlign: 'right'
                        }}>
                            {transferData.recipient.relationship}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'flex-start' }}>
                        <Text style={{
                            fontSize: 16,
                            color: '#DC2626',
                            fontFamily: 'AppFontBold'
                        }}>
                            {formatAmount(transferData.amount)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Compact Account Info */}
            <View style={{
                backgroundColor: '#F8F9FA',
                borderRadius: 8,
                padding: 10,
                marginBottom: 8
            }}>
                <Text style={{
                    fontSize: 14,
                    color: '#6B7280',
                    fontFamily: 'AppFontRegular',
                    textAlign: 'center'
                }}>
                    من {transferData.sourceAccountDisplay}
                </Text>
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

export default TransferSelectionCard