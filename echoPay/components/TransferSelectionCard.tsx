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
            {/* Header */}
            <View style={{ marginBottom: 20, paddingTop: 8 }}>
                <Text style={{
                    fontSize: 28,
                    color: '#000000',
                    fontFamily: 'AppFontBold',
                    textAlign: 'center'
                }}>
                    تأكيد التحويل
                </Text>
            </View>

            {/* Transfer Info - Target on right, Amount on left */}
            <View style={{ marginBottom: 20 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 12,
                }}>
                    {/* Amount on left */}
                    <View style={{ alignItems: 'flex-start' }}>
                        <Text style={{
                            fontSize: 24,
                            color: '#DC2626',
                            fontFamily: 'AppFontBold'
                        }}>
                            {formatAmount(transferData.amount)}
                        </Text>
                    </View>
                    
                    {/* Target on right */}
                    <View style={{ flex: 1, paddingLeft: 12, alignItems: 'flex-end' }}>
                        <Text style={{
                            fontSize: 20,
                            color: '#000000',
                            fontFamily: 'AppFontBold',
                            textAlign: 'right'
                        }}>
                            {transferData.recipient.name}
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: '#6B7280',
                            fontFamily: 'AppFontRegular',
                            textAlign: 'right',
                            marginTop: 4
                        }}>
                            {transferData.recipient.relationship}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Account Info - Show "حساب جاري" */}
            <View style={{
                backgroundColor: '#F8F9FA',
                borderRadius: 8,
                padding: 16,
                marginBottom: 8
            }}>
                <Text style={{
                    fontSize: 18,
                    color: '#374151',
                    fontFamily: 'AppFontRegular',
                    textAlign: 'center'
                }}>
                    من حساب جاري
                </Text>
            </View>
        </View>
    )
}

export default TransferSelectionCard