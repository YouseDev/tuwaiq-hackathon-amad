import React from "react"
import { View, Text, Pressable } from "react-native"

interface InfoCardProps {
    children?: React.ReactNode
    onPress?: () => void
    style?: object
}

const InfoCard = ({ children, onPress, style }: InfoCardProps) => {
    const CardWrapper = onPress ? Pressable : View
    
    return (
        <CardWrapper 
            onPress={onPress}
            style={[
                {
                    backgroundColor: '#ffffff',
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    marginBottom: 16,
                },
                style
            ]}
        >
            {children}
        </CardWrapper>
    )
}

export default InfoCard